import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

interface Space {
  id: string;
  title: string;
  description: string;
  scheduled_for: string;
  share_link: string;
}

export default function SpacesList() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaces() {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching spaces:', error);
      } else {
        setSpaces(data || []);
      }
      setLoading(false);
    }

    fetchSpaces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Upcoming Spaces</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{space.title}</h2>
            <p className="text-gray-600 mb-4">{space.description}</p>
            <p className="text-sm text-gray-500">
              Scheduled for: {format(new Date(space.scheduled_for), 'PPp')}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/space/${space.share_link}`)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copy Invite Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}