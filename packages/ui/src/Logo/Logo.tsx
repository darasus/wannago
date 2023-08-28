import Link, {LinkProps} from 'next/link';

interface Props extends LinkProps {
  className?: string;
}

export function Logo({className, ...props}: Props) {
  return (
    <Link {...props} data-testid="logo-link">
      <LogoView className={className} />
    </Link>
  );
}

export function LogoView({className}: {className?: string}) {
  return (
    <svg
      className="h-[30px]"
      viewBox="0 0 78 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.688 36C10.968 36 8.588 35.252 6.548 33.756C4.542 32.26 2.995 30.152 1.907 27.432C0.819 24.678 0.275 21.414 0.275 17.64C0.275 16.11 0.462 14.444 0.836 12.642C1.244 10.806 1.839 9.072 2.621 7.44C3.403 5.774 4.355 4.414 5.477 3.36C6.599 2.306 7.891 1.779 9.353 1.779C10.883 1.779 12.124 2.323 13.076 3.411C14.062 4.499 14.555 5.842 14.555 7.44C14.555 8.256 14.334 9.31 13.892 10.602C13.45 11.86 13.008 13.22 12.566 14.682C12.124 16.11 11.903 17.504 11.903 18.864C11.903 20.462 12.141 21.584 12.617 22.23C13.093 22.842 13.62 23.148 14.198 23.148C15.048 23.148 15.643 22.723 15.983 21.873C16.357 21.023 16.544 19.408 16.544 17.028C16.544 15.77 16.527 14.427 16.493 12.999C16.493 11.571 16.612 10.228 16.85 8.97C17.122 7.678 17.632 6.624 18.38 5.808C19.162 4.992 20.318 4.584 21.848 4.584C23.378 4.584 24.534 4.975 25.316 5.757C26.132 6.539 26.676 7.559 26.948 8.817C27.22 10.041 27.356 11.35 27.356 12.744C27.39 14.138 27.407 15.464 27.407 16.722C27.407 19.272 27.628 21.057 28.07 22.077C28.512 23.063 29.192 23.556 30.11 23.556C30.79 23.556 31.317 23.182 31.691 22.434C32.065 21.652 32.218 20.462 32.15 18.864C32.082 17.504 31.827 16.161 31.385 14.835C30.943 13.475 30.501 12.166 30.059 10.908C29.651 9.65 29.447 8.494 29.447 7.44C29.447 5.774 29.974 4.431 31.028 3.411C32.082 2.391 33.289 1.881 34.649 1.881C36.247 1.881 37.624 2.408 38.78 3.462C39.936 4.516 40.888 5.859 41.636 7.491C42.384 9.123 42.928 10.84 43.268 12.642C43.642 14.444 43.829 16.11 43.829 17.64C43.829 21.414 43.285 24.678 42.197 27.432C41.109 30.152 39.562 32.26 37.556 33.756C35.55 35.218 33.17 35.949 30.416 35.949C28.954 35.949 27.509 35.626 26.081 34.98C24.653 34.3 23.31 33.263 22.052 31.869C20.794 33.263 19.434 34.3 17.972 34.98C16.544 35.66 15.116 36 13.688 36ZM63.452 35.949C59.644 35.949 56.38 35.269 53.66 33.909C50.974 32.515 48.917 30.56 47.489 28.044C46.095 25.494 45.398 22.502 45.398 19.068C45.398 15.77 45.925 12.948 46.979 10.602C48.067 8.222 49.495 6.284 51.263 4.788C53.031 3.258 54.986 2.136 57.128 1.422C59.27 0.673998 61.429 0.299998 63.605 0.299998C66.461 0.299998 68.909 0.724998 70.949 1.575C72.989 2.391 74.553 3.462 75.641 4.788C76.729 6.114 77.273 7.491 77.273 8.919C77.273 10.449 76.984 11.639 76.406 12.489C75.862 13.339 75.148 13.934 74.264 14.274C73.414 14.614 72.53 14.784 71.612 14.784C70.456 14.784 69.538 14.665 68.858 14.427C68.212 14.155 67.549 13.9 66.869 13.662C66.189 13.424 65.271 13.305 64.115 13.305C61.905 13.305 60.137 13.968 58.811 15.294C57.519 16.62 56.873 18.524 56.873 21.006C56.873 22.468 57.179 23.675 57.791 24.627C58.403 25.579 59.202 26.293 60.188 26.769C61.208 27.245 62.296 27.483 63.452 27.483C64.608 27.483 65.56 27.347 66.308 27.075C67.09 26.769 67.668 26.446 68.042 26.106C68.416 25.766 68.603 25.511 68.603 25.341C66.325 25.341 64.489 25.086 63.095 24.576C61.701 24.032 61.004 22.995 61.004 21.465C61.004 20.173 61.463 19.102 62.381 18.252C63.299 17.368 64.999 16.926 67.481 16.926C69.895 16.926 71.782 17.215 73.142 17.793C74.536 18.337 75.505 19.204 76.049 20.394C76.627 21.584 76.916 23.131 76.916 25.035C76.916 27.075 76.304 28.928 75.08 30.594C73.856 32.26 72.224 33.586 70.184 34.572C68.144 35.524 65.9 35.983 63.452 35.949Z"
        fill="currentColor"
      />
    </svg>
  );
}
