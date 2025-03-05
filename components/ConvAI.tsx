"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";

// No unused functions

export function ConvAI() {
    // Using a simple boolean instead of Conversation object for demo
    const [isActive, setIsActive] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    // Function to toggle the orb state (for testing)
    function toggleSpeaking() {
        if (isConnected) {
            setIsSpeaking(!isSpeaking);
            console.log("Speaking state toggled:", !isSpeaking);
        }
    }

    async function startConversation() {
        console.log("Start conversation button clicked");
        
        // For demo purposes, just set the state directly
        console.log("Setting states to active");
        setIsActive(true);
        setIsConnected(true);
        setIsSpeaking(true);
        
        // Log the current state
        console.log("Current state:", { isActive: true, isConnected: true, isSpeaking: true });
    }

    function endConversation() {
        console.log("End conversation button clicked");
        
        // For demo purposes, just reset the state
        console.log("Setting states to inactive");
        setIsActive(false);
        setIsConnected(false);
        setIsSpeaking(false);
        
        // Log the current state
        console.log("Current state:", { isActive: false, isConnected: false, isSpeaking: false });
    }

    return (
        <div className={"flex justify-center items-center gap-x-4"}>
            <Card className={'rounded-3xl'}>
                <CardContent>
                    <CardHeader>
                        <CardTitle className={'text-center'}>
                            {isConnected ? (
                                isSpeaking ? `Agent is speaking` : 'Agent is listening'
                            ) : (
                                'Disconnected'
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className={'flex flex-col gap-y-4 text-center'}>
                        <div 
                            className={cn('orb my-16 mx-12',
                                isSpeaking ? 'animate-orb' : (isActive && 'animate-orb-slow'),
                                isConnected ? 'orb-active' : 'orb-inactive')}
                            onClick={toggleSpeaking}
                        >
                            <div className="orb-inner-waves"></div>
                        </div>

                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={isActive}
                            onClick={startConversation}
                        >
                            Start conversation
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={!isActive}
                            onClick={endConversation}
                        >
                            End conversation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
