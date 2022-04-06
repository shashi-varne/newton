import React from "react";
import InvestmentProcess from "./InvestmentProcess";

export default {
    component: InvestmentProcess,
    title: 'Pages/DIY/InvestmentProcess',
    parameters: {
        layout: 'fullscreen'
    }
}

export const Default = args => <InvestmentProcess {...args}/>