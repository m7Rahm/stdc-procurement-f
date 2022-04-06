import { app_routes } from "./data";

export const constr_notif_text = (doc_type, notif_type, action, doc_number) => {
    let text = "";
    if (notif_type === 0) {
        switch (doc_type) {
            case 0:
                text = "Sifariş Sənədi";
                break;
            case 1:
                text = "Qiymət Araşdırması";
                break;
            case 2:
                text = "Müqdavilə Sənədi";
                break;
            case 3:
                text = "Ödəniş Sənədi";
                break;
        }
    } else if (notif_type === 1) {
        text = `${doc_number} № `
        switch (doc_type) {
            case 0:
                text += "sifariş sənədi";
                break;
            case 1:
                text += "qiymət araşdırması";
                break;
            case 2:
                text += "müqdavilə sənədi";
                break;
            case 3:
                text += "ödəniş sənədi";
                break;
        }
        text += action === 1 ? " təsdiq olundu" : action === -1 ? " etiraz edildi" : action === -2 ? " redaktəyə qaytarıldı" : ""
    }
    return text;
}
export const get_notif_text = (notif) => {
    const text = notif.doc_type === 0
        ? "Sifariş sənədi"
        : notif.doc_type === 1
            ? "Qiymət araşdırılması sənədi"
            : notif.doc_type === 2
                ? "Müqavilə sənədi"
                : "Ödəniş sənədi"
    if (notif.type === 0)
        return <> Yeni {text}</>
    else if (notif.type === 1)
        return (
            <>
                № <span style={{ color: 'tomato' }}>{notif.doc_number}</span> {text.toLowerCase()} {
                    notif.action === 1
                        ? 'təsdiq edildi'
                        : notif.action === 2
                            ? "redaktəyə qaytarıldı"
                            : notif.action === 3
                                ? "redaktə edildi"
                                : notif.action === -1
                                    ? "etiraz edildi"
                                    : "ləğv edildi"
                }
            </>
        )
}
export const get_notif_link = (module, sub_module, tran_id) => {
    const route = app_routes[module];
    const module_route = route?.link || "/";
    let query = `/${tran_id}`
    const sub_module_route = route?.subs[sub_module] || "";
    return { module: module_route, sub_module: sub_module_route, query }
}
export const getNotifText = (notif) => {
    let text = notif.doc_type === 2
        ? "Müqavilə Razılaşması"
        : notif.doc_type === 1
            ? "Qiymət Təklifi Araşdırması"
            : notif.doc_type === 3
                ? "Ödəniş Razılaşması"
                : "Sifariş"
    if (notif.category_id === 10) {
        text = notif.doc_type === 1
            ? "Büdcə Artırılması Razılaşması"
            : notif.doc_type === 2
                ? "Silinmə Sənədi"
                : ""
    }
    if (notif.category_id === 1 || notif.category_id === 10)
        return <> Yeni {text}</>
    else if (notif.category_id === 2)
        return (
            <>
                № <span style={{ color: 'tomato' }}>{notif.doc_number}</span> sənəd {
                    notif.action === 1
                        ? 'təsdiq edildi'
                        : notif.action === 2
                            ? "redaktəyə qaytarıldı"
                            : notif.action === 3
                                ? "redaktə edildi"
                                : notif.action === -1
                                    ? "etiraz edildi"
                                    : "ləğv edildi"
                }
            </>
        )
}