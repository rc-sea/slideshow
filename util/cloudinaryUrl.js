import { Cloudinary } from 'cloudinary-core';

const cloudinary = Cloudinary.new({ cloud_name: 'louise' });

export default function cloudinaryUrl (publicIdOrResource, transformation) {
  return cloudinary.url(typeof publicIdOrResource === 'string' ? publicIdOrResource : publicIdOrResource.public_id, {
    fetch_format: 'auto',
    quality: 'auto',
    ...transformation,
  });
}
