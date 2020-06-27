const icons = [
  {
    icon: 'mdi-facebook',
    color: '#3b5998',
    title: 'Facebook',
    url: 'http://www.facebook.com/share.php?u={0}',
  },
  {
    icon: 'mdi-twitter',
    color: '#00acee',
    title: 'Twitter',
    url: 'http://twitter.com/share?url={0}',
  },
  {
    icon: 'mdi-instagram',
    color: '#dd2a7b',
    title: 'Instagram',
    url: 'https://www.instagram.com/?url={0}',
  },
];

export function createShareIcons (url) {
  return icons.map(item => {
    return {
      ...item,
      url: item.url.replace('{0}', url),
    };
  });
}
