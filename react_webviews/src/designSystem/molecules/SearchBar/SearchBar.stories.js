import React from "react";
import SearchBar from "./SearchBar";

export default {
    component: SearchBar,
    title: 'Molecules/SearchBar',
    argTypes: {
        inputProps: {
            control:{
                disable: true
            }
        },
        prefix: {
            control:{
                disable: true
            }
        },
        suffix: {
            control:{
                disable: true
            }
        }
    }
}

export const Default = (args) => <SearchBar {...args}/>

Default.args = {
    placeholder: "Search",
}