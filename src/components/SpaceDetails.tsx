import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

interface Space {
  id: string;
  title: string;
  description: string;
  scheduled_for: string;
  share_link: string;
}

export default function SpaceDetails() {
  const { id } = useParams();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpace() {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching space:', error);
      } else {
        setSpace(data);
      }
      setLoading(false);
    }

    fetchSpace();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!space) {
    return <div>Space not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-4">{space.title}</h1>
      <p className="text-gray-600 mb-6">{space.description}</p>
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          Scheduled for: {format(new Date(space.scheduled_for), 'PPp')}
        </p>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/space/${space.share_link}`)}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Copy Invite Link
      </button>
    </div>
  );
}