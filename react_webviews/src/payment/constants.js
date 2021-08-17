import icn_gpay from 'assets/icn_gpay.svg'
import icn_phonepe from 'assets/icn_phonepe.svg'
import icn_paytm from 'assets/icn_paytm.svg'
import whatsapp from 'assets/whatsapp.svg'
import samsung_pay from 'assets/samsung_pay.svg'
import mobikwik from 'assets/mobikwik.svg'
import mi_pay from 'assets/mi_pay.svg'
import cred from 'assets/cred.svg'
import amazon_pay from 'assets/amazon_pay.svg'
import upi_apps from 'assets/upi_apps.svg'
import others from 'assets/icn_more.svg'

export function goBackMap(path) {
    return false;
}

const upi_apps_list = {
    'com.google.android.apps.nbu.paisa.user': icn_gpay,
    'net.one97.paytm': icn_paytm,
    'com.phonepe.app': icn_phonepe,
    'com.whatsapp': whatsapp,
    'com.samsung.android.spay': samsung_pay,
    'com.mobikwik_new': mobikwik,
    'com.mipay.in.wallet': mi_pay,
    'com.dreamplug.androidapp': cred,
    'in.amazon.mShop.android.shopping': amazon_pay,
    'upi_apps': upi_apps,
    'others': others
}
export function getImage(type) {
    if (upi_apps_list[type]) {
        return upi_apps_list[type];
    } else {
        return upi_apps_list['upi_apps'];
    }
}