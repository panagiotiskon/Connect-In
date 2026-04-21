import OptimizedImage from './OptimizedImage';
import useAuthenticatedBlobUrl from '../../hooks/useAuthenticatedBlobUrl';

const isApiPath = (src) => typeof src === 'string' && src.startsWith('/auth/');

const AuthenticatedImage = ({ src, ...rest }) => {
  const needsAuth = isApiPath(src);
  const blobUrl = useAuthenticatedBlobUrl(needsAuth ? src : null);
  const resolvedSrc = needsAuth ? blobUrl : src;
  return <OptimizedImage src={resolvedSrc} {...rest} />;
};

export default AuthenticatedImage;
