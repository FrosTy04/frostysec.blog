interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Circular background */}
        <circle cx="20" cy="20" r="20" className="fill-black dark:fill-white" />
        
        {/* Red Fedora Hat - facing right, profile view */}
        <path
          d="M8 16C8 13 10.5 11 13.5 11C14.5 11 15.5 11.5 16 12C16.5 11.5 17.5 11 18.5 11C21.5 11 24 13 24 16V19C24 19.5 23.5 20 23 20H10C9.5 20 9 19.5 9 19V16Z"
          fill="#DC2626"
        />
        {/* Hat crown creases/folds */}
        <path
          d="M14 11C14 11.5 14.5 12 15 12C15.5 12 16 11.5 16 11"
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 11C18 11.5 18.5 12 19 12C19.5 12 20 11.5 20 11"
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hat brim shadow */}
        <ellipse cx="16.5" cy="19.5" rx="7.5" ry="2" fill="#B91C1C" />
        
        {/* White Face Profile - simple silhouette (forehead, nose, upper lip) facing right */}
        <path
          d="M11 20C11 19 11.5 18.5 12.5 18.5H13C13.5 18.5 14 19 14 19.5V20C14 20.5 14.5 21 15 21H15.5C16 21 16.5 20.5 16.5 20V19.5C16.5 19 17 18.5 18 18.5H18.5C19 18.5 19.5 19 19.5 19.5V20C19.5 20.5 20 21 20.5 21H21C21.5 21 22 20.5 22 20V19.5C22 19 22.5 18.5 23.5 18.5H24C24.5 18.5 25 19 25 19.5V20C25 20.5 25.5 21 26 21H26.5C27 21 27.5 20.5 27.5 20V19.5C27.5 19 28 18.5 29 18.5H29.5C30 18.5 30.5 19 30.5 19.5V25C30.5 25.5 30 26 29.5 26H14.5C14 26 13.5 25.5 13.5 25V20Z"
          className="fill-white dark:fill-black"
        />
        {/* Nose detail line */}
        <path
          d="M19.5 21L20.5 24L21.5 21"
          className="stroke-white dark:stroke-black"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-2xl font-semibold text-black dark:text-white">frostysec.blog</span>
    </div>
  )
}

