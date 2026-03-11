import { requireAuth } from '@/lib/supabase/server-auth';
import { ProfileGenerator } from '@/components/ProfileGenerator';

export default async function GenerateProfilePage() {
  await requireAuth();

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Profile Generation</h1>
        <ProfileGenerator />
      </div>
    </div>
  );
}
