import type { SVGProps } from 'react';

export function Gs1Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GS1 Logo"
      {...props}
    >
      <path
        d="M20.3607 43.3412H10V16.4035H20.3607C27.609 16.4035 33.2941 20.1726 33.2941 29.78C33.2941 39.3874 27.609 43.3412 20.3607 43.3412ZM20.6746 20.5765H15.5176V39.1682H20.6746C25.0172 39.1682 27.7765 36.5929 27.7765 29.8722C27.7765 23.1514 25.0172 20.5765 20.6746 20.5765Z"
        fill="currentColor" // Use currentColor to inherit text color or apply specific class
      />
      <path
        d="M54.0031 43.3412H38.1914V16.4035H53.689V20.5765H43.709V27.8667H52.6267V31.8824H43.709V39.1682H54.0031V43.3412Z"
        fill="currentColor"
      />
      <path
        d="M61.931 16.4035H77.2604L70.2251 29.78L77.1682 43.3412H61.8388L58.0698 35.9584L54.3008 43.3412H38.9714L46.0067 29.78L39.0635 16.4035H54.3929L58.162 23.7843L61.931 16.4035Z"
        className="text-accent" // Example: make the "1" accent color
      />
    </svg>
  );
}
