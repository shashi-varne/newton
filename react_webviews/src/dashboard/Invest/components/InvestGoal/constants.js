export const SAVE_GOAL_MAPPER = {
    retirement:[
        {
            name:"Simple",
            icon:require("assets/scooter.png"),
            corpus:10000000
        },
        {
            name:"Comfortable",
            icon:require("assets/car.png"),
            corpus:20000000
        },
        {
            name:"Lavish",
            icon:require("assets/limo.png"),
            corpus:50000000
        }
    ],
    childeducation:[
        {
            name:"Simple",
            icon:require("assets/simple_edu.png"),
            corpus:400000
        },
        {
            name:"Comfortable",
            icon:require("assets/comfortable_edu.png"),
            corpus:1000000
        },
        {
            name:"Lavish",
            icon:require("assets/lavish_edu.png"),
            corpus:3000000
        }
    ],
    childwedding:[
        {
            name:"Simple",
            icon:require("assets/simple_wedding.png"),
            corpus:600000
        },
        {
            name:"Comfortable",
            icon:require("assets/comfortable_wedding.png"),
            corpus:1500000
        },
        {
            name:"Lavish",
            icon:require("assets/lavish_wedding.png"),
            corpus:3000000
        }
    ],
    vacation:[
        {
            name:"Simple",
            icon:require("assets/bus.png"),
            corpus:50000
        },
        {
            name:"Comfortable",
            icon:require("assets/train.png"),
            corpus:200000
        },
        {
            name:"Lavish",
            icon:require("assets/plane.png"),
            corpus:500000
        }
    ]
}

export const CUSTOM_GOAL_TARGET_MAP = {
    retirement: 20000000,
    childeducation: 1000000,
    childwedding: 1500000,
    vacation: 200000,
    other: 20000000
};

export const SUBTYPE_NAME_MAP = {
    retirement: 'retirement',
    childeducation: "child's education",
    childwedding: "child's wedding",
    vacation: "vacation",
    other: "other"
}