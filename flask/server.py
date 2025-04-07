import pandas as pd
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import logging
import time
import numpy as np
import gc
import os
from flask import Flask, request, jsonify
import nltk
nltk.download('punkt')
nltk.download('stopwords')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SpotifySongRecommender:
    def __init__(self, client_id, client_secret, data_path='spotify_millsongdata.csv', subset_size=None):
        try:
            client_credentials_manager = SpotifyClientCredentials(
                client_id=client_id, 
                client_secret=client_secret
            )
            self.sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
            logger.info("Successfully connected to Spotify API")
        except Exception as e:
            logger.error(f"Failed to connect to Spotify API: {e}")
            raise
        
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            logger.info("Downloading NLTK punkt")
            nltk.download('punkt', quiet=True)
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            logger.info("Downloading NLTK stopwords")
            nltk.download('stopwords', quiet=True)
        
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        try:
            logger.info(f"Loading dataset from {data_path}")
            self.df = pd.read_csv(data_path, usecols=['song', 'artist', 'text'])
            if subset_size is not None and subset_size < len(self.df):
                logger.info(f"Using subset of {subset_size} rows from dataset")
                self.df = self.df.sample(n=subset_size, random_state=42)
            logger.info(f"Dataset loaded with {len(self.df)} rows")
            gc.collect()
        except Exception as e:
            logger.error(f"Failed to load dataset: {e}")
            raise
        
        self._preprocess_dataset()
        self._create_tfidf_matrix()
    
    def _preprocess_text(self, text):
        text = str(text).lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\d+', ' ', text)
        tokens = nltk.word_tokenize(text)
        processed_tokens = [
            self.stemmer.stem(word) for word in tokens 
            if word not in self.stop_words and len(word) > 2
        ]
        return " ".join(processed_tokens)
    
    def _preprocess_dataset(self):
        logger.info("Preprocessing dataset...")
        start_time = time.time()
        self.df['song'] = self.df['song'].astype(str).str.strip().str.lower()
        self.df['artist'] = self.df['artist'].astype(str).str.strip().str.lower()
        batch_size = 500
        total_rows = len(self.df)
        self.df['processed_text'] = None
        for i in range(0, total_rows, batch_size):
            end_idx = min(i + batch_size, total_rows)
            batch = self.df.iloc[i:end_idx]
            processed_batch = batch['text'].apply(self._preprocess_text)
            self.df.loc[batch.index, 'processed_text'] = processed_batch
            if i % 2000 == 0 and i > 0:
                logger.info(f"Processed {i}/{total_rows} records...")
                gc.collect()
        if 'text' in self.df.columns:
            self.df = self.df.drop('text', axis=1)
            gc.collect()
        logger.info(f"Dataset preprocessing completed in {time.time() - start_time:.2f} seconds")
    
    def _create_tfidf_matrix(self):
        logger.info("Creating TF-IDF matrix...")
        start_time = time.time()
        tfidf = TfidfVectorizer(
            analyzer='word',
            stop_words='english',
            max_features=3000,
            ngram_range=(1, 1),
            min_df=3,
            max_df=0.8,
            dtype=np.float32
        )
        self.tfidf_matrix = tfidf.fit_transform(self.df['processed_text'])
        logger.info(f"TF-IDF matrix created with shape {self.tfidf_matrix.shape}")
        mmap_file = 'cosine_sim_temp.dat'
        n_rows = self.tfidf_matrix.shape[0]
        fp = np.memmap(mmap_file, dtype='float32', mode='w+', shape=(n_rows, n_rows))
        batch_size = 1000
        for i in range(0, n_rows, batch_size):
            end = min(i + batch_size, n_rows)
            batch = self.tfidf_matrix[i:end]
            batch_cosine = cosine_similarity(batch, self.tfidf_matrix, dense_output=True).astype(np.float32)
            fp[i:end] = batch_cosine
            if i % 2000 == 0 and i > 0:
                logger.info(f"Processed cosine similarity for {i}/{n_rows} rows")
                fp.flush()
        fp.flush()
        self.cosine_sim = np.memmap(mmap_file, dtype='float32', mode='r', shape=(n_rows, n_rows))
        logger.info(f"Cosine similarity matrix created in {time.time() - start_time:.2f} seconds")
    
    def search_spotify_tracks(self, query, limit=10):
        try:
            results = self.sp.search(q=query, type='track', limit=limit)
            tracks = []
            for track in results['tracks']['items']:
                track_info = {
                    'id': track['id'],
                'title': track['name'],
                'artist': track['artists'][0]['name'],
                'coverUrl': track['album']['images'][0]['url'] if track['album']['images'] else None
                }
                tracks.append(track_info)
            return tracks
        except Exception as e:
            logger.error(f"Error searching Spotify tracks: {e}")
            return []
    
    def recommend_songs(self, song_name, artist_name=None, top_n=5):
        logger.info(f"Finding recommendations for '{song_name}' by '{artist_name if artist_name else 'any artist'}'")
        local_recommendations = self._local_recommendations(song_name, artist_name, top_n)
        spotify_recommendations = self.search_spotify_tracks(
            f"{song_name} {artist_name if artist_name else ''}".strip(), 
            limit=top_n
        )
        return {
            'local_recommendations': local_recommendations,
            'spotify_recommendations': spotify_recommendations
        }
    
    def _local_recommendations(self, song_name, artist_name=None, top_n=5):
        song_name = song_name.strip().lower()
        try:
            idx = None
            if artist_name:
                artist_name = artist_name.strip().lower()
                mask = (self.df['song'] == song_name) & (self.df['artist'] == artist_name)
                if mask.any():
                    idx = self.df[mask].index[0]
                else:
                    possible_songs = self.df[self.df['song'].str.contains(song_name)]
                    if not possible_songs.empty:
                        idx = possible_songs.index[0]
            else:
                possible_songs = self.df[self.df['song'] == song_name]
                if not possible_songs.empty:
                    idx = possible_songs.index[0]
                else:
                    possible_songs = self.df[self.df['song'].str.contains(song_name)]
                    if not possible_songs.empty:
                        idx = possible_songs.index[0]
            
            recommendations = []
            # No matching song found, so return random recommendations
            if idx is None:
                logger.info("No matching song found; returning random recommendations")
                random_songs = self.df.sample(n=top_n)
                for i in random_songs.index:
                    song_title = self.df.loc[i, 'song']
                    song_artist = self.df.loc[i, 'artist']
                    query = f"{song_title} {song_artist}"
                    spotify_search = self.search_spotify_tracks(query, limit=1)
                    if spotify_search:
                        recommendations.append(spotify_search[0])
                    else:
                        recommendations.append({
                            'id': f'local_{i}',
                            'title': song_title,
                            'artist': song_artist,
                            'coverUrl': None
                        })
                return recommendations
            
            # Get index location from DataFrame index and calculate similarity scores
            row_num = self.df.index.get_loc(idx)
            similarity_scores = list(enumerate(self.cosine_sim[row_num]))
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
            similar_indices = [i[0] for i in similarity_scores[1:top_n+1]]
            similar_song_indices = [self.df.index[i] for i in similar_indices]
            
            for i in similar_song_indices:
                song_title = self.df.loc[i, 'song']
                song_artist = self.df.loc[i, 'artist']
                query = f"{song_title} {song_artist}"
                spotify_search = self.search_spotify_tracks(query, limit=1)
                if spotify_search:
                    recommendations.append(spotify_search[0])
                else:
                    recommendations.append({
                        'id': f'local_{i}',
                        'title': song_title,
                        'artist': song_artist,
                        'coverUrl': None
                    })
            
            return recommendations
        except Exception as e:
            logger.error(f"Error in local recommendations: {e}")
            return [{
                'id': '',
                'title': "Error processing local recommendations",
                'artist': "",
                'coverUrl': None
            }]
    
    def __del__(self):
        if hasattr(self, 'cosine_sim') and isinstance(self.cosine_sim, np.memmap):
            del self.cosine_sim
            if os.path.exists('cosine_sim_temp.dat'):
                try:
                    os.remove('cosine_sim_temp.dat')
                    logger.info("Removed temporary cosine similarity file")
                except:
                    pass

# Replace with your actual Spotify Developer credentials
CLIENT_ID = '413bbe9d5d5645ecad0dcb59aacc04a6'
CLIENT_SECRET = '1e393a72594c43f5a5d9b460b6a64e04'

recommender = SpotifySongRecommender(
    CLIENT_ID, 
    CLIENT_SECRET,
    subset_size=20000  # Adjust based on available memory
)

# app = Flask(__name__)

# @app.route('/recommend', methods=['POST'])
# def recommend():
#     data = request.get_json()
#     song = data.get('song')
#     print("song", song)
#     artist = data.get('artist')
#     if not song:
#         return jsonify({"error": "Song name is required"}), 400
#     result = recommender.recommend_songs(song, artist)
#     return jsonify(result)
# @app.route('/get', methods=['GET'])
# def get():
#     print("get")



# if __name__ == "__main__":
#     app.run(host="0.0.0.0",port=5555)
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    song = data.get('song')
    print("song:", song)
    artist = data.get('artist')
    if not song:
        return jsonify({"error": "Song name is required"}), 400
    result = recommender.recommend_songs(song, artist)
    return jsonify(result)

@app.route('/get', methods=['GET'])
def get():
    print("get")
    return jsonify({"message": "GET request received"})  # Added a response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555)
