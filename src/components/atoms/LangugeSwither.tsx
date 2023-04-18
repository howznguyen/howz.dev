import { useTrans } from '@/lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

const LangugeSwither = () => {
    const trans = useTrans();
    const router = useRouter()
    const langs = trans.lang;

    return (
        <div className="flex gap-x-2">
            {langs.map(({value, label} : any, i: number) => 
                <Link href={router.asPath} locale={value} className={`${router.locale === value ? "font-semibold" : ""}`} key={i}>{label}</Link>
            )}
        </div>
    )
}

export default LangugeSwither