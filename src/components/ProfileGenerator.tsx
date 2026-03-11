'use client';

import { useState } from 'react';
import { generateProfile, GenerateProfileResponse } from '@/services/api';
import { saveProfile } from '@/app/account/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';

export function ProfileGenerator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1 Form Data
  const [url, setUrl] = useState('');
  const [userType, setUserType] = useState('Photographer');

  // AI Generated Data
  const [generatedData, setGeneratedData] = useState<GenerateProfileResponse | null>(null);
  
  // Selection Data
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateProfile({ url, user_type: userType });
      setGeneratedData(data);
      // Automatically select first 4 images if available
      setSelectedImages(data.image_urls.slice(0, 4));
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to generate profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageSelection = (imgUrl: string) => {
    if (selectedImages.includes(imgUrl)) {
      setSelectedImages(selectedImages.filter(img => img !== imgUrl));
    } else {
      if (selectedImages.length < 4) {
        setSelectedImages([...selectedImages, imgUrl]);
      } else {
        setError('You can select a maximum of 4 images.');
      }
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await saveProfile({
        name: generatedData.name,
        profile_type: generatedData.profile_type,
        short_description: generatedData.short_description,
        long_description: generatedData.long_description,
        image_urls: selectedImages,
        keywords: generatedData.keywords,
        source_url: url,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Profile</CardTitle>
          <CardDescription>Enter a portfolio or social media URL to auto-generate your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="url">Portfolio or Social URL</Label>
              <Input 
                id="url" 
                type="url" 
                placeholder="https://instagram.com/yourhandle" 
                required 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">Creative Type</Label>
              <Select value={userType} onValueChange={(val) => val && setUserType(val)}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Photographer">Photographer</SelectItem>
                  <SelectItem value="Model">Model</SelectItem>
                  <SelectItem value="Brand">Brand</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Analyzing Profile..." : "Generate AI Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Review and Edit
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Review Generated Profile</CardTitle>
        <CardDescription>We've generated the following profile. Select up to 4 images to showcase.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <div className="font-semibold text-lg">{generatedData?.name}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <div className="font-semibold">{generatedData?.profile_type}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Short Description</Label>
              <div className="text-sm">{generatedData?.short_description}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">About</Label>
              <div className="text-sm text-muted-foreground">{generatedData?.long_description}</div>
            </div>
            <div>
              <Label className="text-muted-foreground mb-2 block">Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {generatedData?.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Select Featured Images ({selectedImages.length}/4)</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {generatedData?.image_urls.map((imgUrl, idx) => {
                const isSelected = selectedImages.includes(imgUrl);
                return (
                  <div 
                    key={idx} 
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'}`}
                    onClick={() => toggleImageSelection(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Generated ${idx}`} className="w-full h-32 object-cover" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-background rounded-full">
                        <CheckCircle className="w-6 h-6 text-primary" weight="fill" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={handleSave} disabled={isLoading || selectedImages.length === 0}>
            {isLoading ? "Saving..." : "Publish Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
