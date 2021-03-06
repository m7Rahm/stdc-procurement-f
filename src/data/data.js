export const app_routes = [
    { link: "/orders", subs: ["/my-orders", "/returned", "/visas", "/agreements", "/contracts", "/payments"] },
    { link: "/admin", subs: ["/roles", "/users", "/structure", "/materials"] },
    { link: "/contracts", subs: ["/contracts", "/express-contracts", "/payments"] },
    { link: "/tender", subs: ["/orders", "/new-offer"] },
];
export const colors = {
    dark: {
        primary: "#17223B",
        secondary: "#F05454",
        navbar: "#17223B",
        text_primary: "white",
        accent: "#5584AC",
        ribbon: "#17223B",
        even_row: "#e1e1e1",
        odd_row: "#EEF2FF"
    },
    light: {
        primary: "#22577E",
        secondary: "rgb(255, 170, 0)",
        navbar: "linear-gradient(to bottom, white, #ecf1f8)",
        text_primary: "#373737",
        accent: "#5584AC",
        ribbon: "#22577E",
        even_row: "#e1e1e1",
        odd_row: "white"
    }
}
export const newOrderInitial = {
    materials: [
        {
            id: Date.now(),
            materialId: '',
            model: '',
            code: '',
            department: '',
            approx_price: 0,
            additionalInfo: '',
            place: "",
            class: '',
            subGlCategory: '',
            count: 1
        }
    ],
    glCategory: '-1',
    structure: '-1',
    comment: '',
    review: '',
    ordNumb: '',
    orderType: 0
}

export const newOfferInitial = [{
    id: Date.now(),
    name: "",
    count: 0,
    note: "",
    price: 0,
    total: 0
}]

export const serverAddress = "http://172.16.3.64"
export const serverPort = ""
export const months = [
    {
        name: 'Yanvar',
        value: '01'
    },
    {
        name: 'Fevral',
        value: '02'
    },
    {
        name: 'Mart',
        value: '03'
    },
    {
        name: 'Aprel',
        value: '04'
    },
    {
        name: 'May',
        value: '05'
    },
    {
        name: 'Iyun',
        value: '06'
    },
    {
        name: 'Iyul',
        value: '07'
    },
    {
        name: 'Avqust',
        value: '08'
    },
    {
        name: 'Sentyabr',
        value: '09'
    },
    {
        name: 'Oktyabr',
        value: '10'
    },
    {
        name: 'Noyabr',
        value: '11'
    },
    {
        name: 'Dekabr',
        value: '12'
    }
]


export const availableLinks = [
    'Sifarişlərim',
    'Vizalarım',
    'Drafts',
    'Arxiv',
    'Gələnlər',
    'Qiymət təklifləri',
    'Anbar',
    'Users',
    'System Params',
    'Structure',
    'Dashboard',
    'Büccə'
];
export const availableOperations = [
    'Sifariş yaratmaq',
    'Sifarişi təsdiq etmək',
    'Sifarişə etiraz etmək',
    'Sifarişi redaktəyə qaytarmaq',
    'Sifarişi redaktə etmək',
    'Büccə daxil etmək',
    'Yeni məhsul əlavə etmək',
    "Digər sifarişləri görmək"
];

export const miscDocTypes = [
    {
        val: "0",
        text: "Hamısı"
    },
    {
        val: "1",
        text: "Büdcə artırılması"
    },
    {
        val: "2",
        text: "Silinmə"
    },
]
export const modules = [
    {
        text: 'Admin',
        link: '/admin'
    },
    {
        text: 'Budget',
        link: '/budget'
    },
    {
        text: 'Orders',
        link: '/orders'
    },
    {
        text: 'Contracts',
        link: '/contracts'
    },
    {
        text: 'Tender',
        link: '/tender'
    },
    {
        text: 'Warehouse',
        link: '/warehouse'
    },
    {
        text: 'Other',
        link: '/other'
    }
]
export const expressVendorInit = {
    name: '',
    voen: '',
    sphere: '1',
    type: '1',
    residency: '1',
    tax_type: '1',
    tax_percentage: '0',
    legal_address: '',
    actual_address: '',
    saa: '',
    phone_numbers: [],
    emails: [],
    risk_zone: '1',
    reg_date: '',
    vendor_type: '1',
    files: []
}
export const structureTypes = [
    {
        val: "0",
        text: "Struktur vahidi"
    },
    {
        val: "1",
        text: "Anbar"
    }
]
export const vendorTypes = [
    {
        val: 1,
        text: 'Fiziki şəxs'
    },
    {
        val: 2,
        text: 'Hüquqi şəxs'
    }
];
export const optionsAgreements = [
    {
        val: "-3",
        text: "Hamısı"
    },
    {
        val: "0",
        text: "Gözləyən"
    },
    {
        val: "1",
        text: "Təsdiq edilmiş"
    },
    {
        val: "-1",
        text: "Etiraz edilmiş"
    }
];
export const optionsReadyOrders = [
    {
        val: "-3",
        text: "Hamısı"
    },
    {
        val: "0",
        text: "Gözləyən"
    },
    {
        val: "31",
        text: "Razılaşdırılmış"
    },
    {
        val: "30",
        text: "Razılaşmada"
    }
]
export const workSectors = [
    {
        val: 1,
        text: 'Satış'
    },
    {
        val: 2,
        text: 'Ximət'
    }
];
export const taxTypes = [
    {
        val: 1,
        text: 'ƏDV'
    },
    {
        val: 2,
        text: 'Sadələşdirilmiş'
    },
    {
        val: 3,
        text: 'Ticarət və ictimai iaşə'
    }
];
export const riskZones = [
    {
        val: 1,
        text: 'Orta'
    },
    {
        val: 2,
        text: 'Yüksək'
    },
    {
        val: 3,
        text: 'Qara siyahı'
    }
];

export const productUnit = [
    {
        val: 1,
        text: 'Ədəd'
    },
    {
        val: 2,
        text: 'Kg'
    },
    {
        val: 3,
        text: 'L'
    }, {
        val: 4,
        text: 'M'
    }
]