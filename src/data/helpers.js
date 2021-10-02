import { routes } from "./data"
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
    const route = routes.find(route => route.id === module);
    const module_route = route?.link || "/";
    let query = `/${tran_id}`
    const sub_module_route = route?.sub_modules.find(route => route.id === sub_module)?.link || ""
    return { module: module_route, sub_module: sub_module_route, query }
}