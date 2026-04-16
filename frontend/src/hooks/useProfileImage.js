import useSWR from 'swr';
import FileService from '../api/UserFilesApi';

const fetchProfileImage = async (userId) => {
  const images = await FileService.getUserImages(userId);
  if (images?.length > 0) {
    return `data:${images[0].type};base64,${images[0].data}`;
  }
  return '/593.jpg';
};

const useProfileImage = (userId) => {
  const { data, isLoading } = useSWR(
    userId ? ['profileImage', userId] : null,
    ([, id]) => fetchProfileImage(id),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return { profileImage: data ?? '/593.jpg', isLoading };
};

export default useProfileImage;
