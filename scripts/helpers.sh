#!/bin/bash 

silence() { 
    "$@">/dev/null 2>&1 
    local RETVAL=$? 
    if [[ $RETVAL -eq 0 ]]
    then
        return 0;
    else
        return -1; 
    fi
} 
