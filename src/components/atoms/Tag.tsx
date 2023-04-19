import { Route } from '@/lib';
import Link from 'next/link'
interface TagProps {
    name: string;
}

const Tag = ({name} : TagProps) => {
  return (
    <Link
        href={Route.tag.get(name)}
        className="bg-opacity-80 dark:!bg-opacity-60 inline-block rounded-md px-1.5 py-0.5 font-medium transition-colors bg-gray-100 text-gray-700 hover:text-black disabled:text-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-white dark:disabled:bg-gray-600 focus:outline-none mr-2"
        tabIndex={-1}
    >
        {name}
    </Link>
  )
}

export default Tag