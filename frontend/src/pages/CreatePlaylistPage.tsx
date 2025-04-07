import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreatePlaylistPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Playlist created!",
      description: "Your new playlist has been created successfully",
    });
    
    setIsSubmitting(false);
    navigate("/library");
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add an optional description for your playlist"
                  className="min-h-24"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Playlist"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="col-span-1 space-y-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-6">
                <Music size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Add songs later</h3>
                <p className="text-sm text-muted-foreground">
                  After creating your playlist, you can search and add songs from your library
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-4">
                <PlusCircle size={24} className="text-primary mb-2" />
                <p className="text-sm">
                  Create as many playlists as you want and organize your music your way
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
