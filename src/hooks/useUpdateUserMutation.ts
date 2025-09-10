import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UpdateUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  photoURL?: string;
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const { id, ...updateData } = data;
      const response = await apiRequest('PUT', `/api/users/${id}`, updateData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
  });
};