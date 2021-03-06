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
    'Sifari??l??rim',
    'Vizalar??m',
    'Drafts',
    'Arxiv',
    'G??l??nl??r',
    'Qiym??t t??klifl??ri',
    'Anbar',
    'Users',
    'System Params',
    'Structure',
    'Dashboard',
    'B??cc??'
];
export const availableOperations = [
    'Sifari?? yaratmaq',
    'Sifari??i t??sdiq etm??k',
    'Sifari???? etiraz etm??k',
    'Sifari??i redakt??y?? qaytarmaq',
    'Sifari??i redakt?? etm??k',
    'B??cc?? daxil etm??k',
    'Yeni m??hsul ??lav?? etm??k',
    "Dig??r sifari??l??ri g??rm??k"
];

export const miscDocTypes = [
    {
        val: "0",
        text: "Ham??s??"
    },
    {
        val: "1",
        text: "B??dc?? art??r??lmas??"
    },
    {
        val: "2",
        text: "Silinm??"
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
        text: 'Fiziki ????xs'
    },
    {
        val: 2,
        text: 'H??quqi ????xs'
    }
];
export const optionsAgreements = [
    {
        val: "-3",
        text: "Ham??s??"
    },
    {
        val: "0",
        text: "G??zl??y??n"
    },
    {
        val: "1",
        text: "T??sdiq edilmi??"
    },
    {
        val: "-1",
        text: "Etiraz edilmi??"
    }
];
export const optionsReadyOrders = [
    {
        val: "-3",
        text: "Ham??s??"
    },
    {
        val: "0",
        text: "G??zl??y??n"
    },
    {
        val: "31",
        text: "Raz??la??d??r??lm????"
    },
    {
        val: "30",
        text: "Raz??la??mada"
    }
]
export const workSectors = [
    {
        val: 1,
        text: 'Sat????'
    },
    {
        val: 2,
        text: 'Xim??t'
    }
];
export const taxTypes = [
    {
        val: 1,
        text: '??DV'
    },
    {
        val: 2,
        text: 'Sad??l????dirilmi??'
    },
    {
        val: 3,
        text: 'Ticar??t v?? ictimai ia????'
    }
];
export const riskZones = [
    {
        val: 1,
        text: 'Orta'
    },
    {
        val: 2,
        text: 'Y??ks??k'
    },
    {
        val: 3,
        text: 'Qara siyah??'
    }
];

export const productUnit = [
    {
        val: 1,
        text: '??d??d'
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