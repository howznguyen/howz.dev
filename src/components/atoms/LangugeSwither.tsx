import { useTrans } from '@/lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from './Button';

const LangugeSwither = () => {
    const trans = useTrans();
    const { locale } = useRouter()
    const langs = [...trans.lang];
    const nextIndex = langs.findIndex((l) => l.value === locale) === langs.length - 1 ? 0 : langs.findIndex((l) => l.value === locale) + 1;
    const nextLocate = langs[nextIndex].value;

    return (
        <Link href={"#"} locale={nextLocate}>
            <Button className="flex gap-x-2 p-[0.45rem] px-2.5" removeClassName={["p-2.5"]}>
                {langs.map(({value, label} : any, i: number) => <span key={i} className={`${locale === value ? "font-bold underline" : ""}`}>{label}</span>)}
            </Button>
        </Link>
    )
}

export default LangugeSwither