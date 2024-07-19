import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

export const Footer = () => {
  return (
    <footer>
      <div>&copy; lisce18</div>

      <div className='link-wrapper'>
        <a href='https://github.com/lisce18'>
          <IconBrandLinkedin />
        </a>
        <a href='https://www.linkedin.com/in/wilhelm-lövgren-olofsson/'>
          <IconBrandGithub />
        </a>
      </div>
    </footer>
  );
};
