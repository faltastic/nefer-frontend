'use client';

import { useState } from 'react';
import { generateProfile, GenerateProfileResponse } from '@/services/api';
import { registerUser } from '@/app/join/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export function SignupFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1 Form Data
  const [url, setUrl] = useState('');
  const [userType, setUserType] = useState('Photographer');
  const [inviteCode, setInviteCode] = useState('');

  // AI Generated Data
  const [generatedData, setGeneratedData] = useState<GenerateProfileResponse | null>(null);
  
  // Selection Data
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Step 3 Form
  const signupForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const [signupResult, setSignupResult] = useState<'confirmation' | 'waitlist' | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateProfile({ url, user_type: userType });
      setGeneratedData(data);
      // Only select the first image by default
      if (data.image_urls.length > 0) {
        setSelectedImages([data.image_urls[0]]);
      }
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

  const updateGeneratedData = (field: keyof GenerateProfileResponse, value: any) => {
    if (!generatedData) return;
    setGeneratedData({ ...generatedData, [field]: value });
  };

  const handleContinueToAccount = () => {
    if (selectedImages.length === 0) {
      setError('Please select at least 1 image.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const onSignupSubmit = async (data: FormValues) => {
    if (!generatedData) return;
    setIsLoading(true);
    setError(null);

    const profileData = {
      name: generatedData.name,
      profile_type: generatedData.profile_type,
      short_description: generatedData.short_description,
      long_description: generatedData.long_description,
      image_urls: selectedImages,
      keywords: generatedData.keywords,
      source_url: url,
    };

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        inviteCode,
        url,
        profileData,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSignupResult(result.type as 'confirmation' | 'waitlist');
        setStep(4);
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-6">
        {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
        <form onSubmit={handleGenerate} className="space-y-6">
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
            <Label htmlFor="inviteCode">Invitation Code (Optional)</Label>
            <Input 
              id="inviteCode" 
              type="text" 
              placeholder="e.g. NEFER2026" 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Have an invite code? Enter it to get immediate access!
            </p>
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
          
          <Button type="submit" className="w-full" disabled={isLoading || !url}>
            {isLoading ? "Analyzing..." : "Generate Preview"}
          </Button>
        </form>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Preview & Edit Your Card</h3>
          <p className="text-sm text-muted-foreground">Review the AI-generated details and select your featured images.</p>
        </div>
        
        {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Featured Images ({selectedImages.length}/4)</Label>
            <div className="grid grid-cols-3 gap-2">
              {generatedData?.image_urls.map((imgUrl, idx) => {
                const isSelected = selectedImages.includes(imgUrl);
                return (
                  <div 
                    key={idx} 
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 aspect-square transition-all ${isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-zinc-800'}`}
                    onClick={() => toggleImageSelection(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Generated ${idx}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-background rounded-full">
                        <CheckCircle className="w-4 h-4 text-primary" weight="fill" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Display Name</Label>
                <Input 
                  id="edit-name" 
                  value={generatedData?.name || ''} 
                  onChange={(e) => updateGeneratedData('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Creative Type</Label>
                <Input 
                  id="edit-type" 
                  value={generatedData?.profile_type || ''} 
                  onChange={(e) => updateGeneratedData('profile_type', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-short">Tagline (Short Description)</Label>
              <Input 
                id="edit-short" 
                value={generatedData?.short_description || ''} 
                onChange={(e) => updateGeneratedData('short_description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-keywords">Keywords (comma separated)</Label>
              <Input 
                id="edit-keywords" 
                value={generatedData?.keywords.join(', ') || ''} 
                onChange={(e) => updateGeneratedData('keywords', e.target.value.split(',').map(k => k.trim()))}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic text-center bg-muted/20 py-2 rounded">
            Don't worry! You can further refine these details and your full bio in your dashboard later.
          </p>
        </div>

        <div className="flex gap-2 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading} className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinueToAccount} disabled={isLoading || selectedImages.length === 0} className="flex-1">
            Next: Account Details
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Create Account</h3>
          <p className="text-sm text-muted-foreground">Enter your email and password to finish signing up.</p>
        </div>

        {error && <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
        
        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" placeholder="you@example.com" {...signupForm.register("email")} />
            {signupForm.formState.errors.email && (
              <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" placeholder="••••••••" {...signupForm.register("password")} />
            {signupForm.formState.errors.password && (
              <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setStep(2)} disabled={isLoading} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Complete Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Step 4: Success Message
  return (
    <div className="text-center py-8 space-y-4 flex flex-col items-center">
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
      {signupResult === 'confirmation' ? (
        <>
          <h3 className="text-2xl font-bold">Check your email</h3>
          <p className="text-muted-foreground">
            We've sent a confirmation link to your email address. Please click the link to verify your account and login.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold">Request Received</h3>
          <p className="text-muted-foreground">
            Thanks for applying! You've been added to our waitlist. We are reviewing your request and will email you as soon as you're approved to join.
          </p>
        </>
      )}
    </div>
  );
}