import en from '@/lang/en';
import vi from '@/lang/vi';

const getTransServer = (localOveride: string = "vi") => {
    const trans = localOveride === 'vi' ? vi : en
    return trans
}

export default getTransServer