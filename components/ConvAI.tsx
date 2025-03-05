"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";

// Function to request microphone access
async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true});
        console.log("Microphone access granted!");
        return true;
    } catch (error) {
        console.error('Microphone error:', error);
        
        // Show friendly error messages
        if (error.name === 'NotAllowedError') {
            alert("Please allow microphone access to talk with the assistant.");
        } else if (error.name === 'NotFoundError') {
            alert("No microphone found. Please connect a microphone.");
        } else {
            alert("Microphone error: " + error.message);
        }
        return false;
    }
}

export function ConvAI() {
    // States for the conversation
    const [isActive, setIsActive] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // New states for DronaHQ embedding
    const [isEmbedded, setIsEmbedded] = useState(false);
    const [userRole, setUserRole] = useState("");

    // Check if running in an iframe (DronaHQ)
    useEffect(() => {
        // Are we inside an iframe?
        const embedded = window.self !== window.top;
        setIsEmbedded(embedded);
        console.log("App is embedded:", embedded);
        
        // Get user role from URL
        const params = new URLSearchParams(window.location.search);
        const role = params.get('userRole');
        if (role) {
            setUserRole(role);
            console.log("User role:", role);
        }
        
        // Listen for messages from DronaHQ
        window.addEventListener('message', (event) => {
            console.log("Got message:", event.data);
            
            // If DronaHQ sends user info
            if (event.data.type === 'UPDATE_USER') {
                setUserRole(event.data.user?.role || "");
            }
        });
        
        // Tell DronaHQ we're ready
        if (embedded) {
            window.parent.postMessage({ 
                type: 'GRACE_READY',
                status: 'ready'
            }, '*');
        }
    }, []);
    
    // Function to send messages to DronaHQ
    const sendToDronaHQ = (type, data) => {
        if (isEmbedded) {
            window.parent.postMessage({
                type: type,
                data: data
            }, '*');
        }
    };

    // Function to toggle the orb state (for testing)
    function toggleSpeaking() {
        if (isConnected) {
            setIsSpeaking(!isSpeaking);
            console.log("Speaking state toggled:", !isSpeaking);
            
            // Tell DronaHQ about the change
            sendToDronaHQ('SPEAKING_CHANGED', { isSpeaking: !isSpeaking });
        }
    }

    async function startConversation() {
        console.log("Start conversation button clicked");
        
        // Check microphone permission first
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            console.log("Microphone permission denied");
            return;
        }
        
        // For demo purposes, just set the state directly
        console.log("Setting states to active");
        setIsActive(true);
        setIsConnected(true);
        setIsSpeaking(true);
        
        // Log the current state
        console.log("Current state:", { isActive: true, isConnected: true, isSpeaking: true });
        
        // Tell DronaHQ conversation started
        sendToDronaHQ('CONVERSATION_STARTED', { timestamp: new Date().toISOString() });
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
        
        // Tell DronaHQ conversation ended
        sendToDronaHQ('CONVERSATION_ENDED', { timestamp: new Date().toISOString() });
    }

    return (
        <div className={"flex flex-col justify-center items-center gap-y-4 w-full max-w-md"}>
            {/* Add a title that shows if embedded */}
            {isEmbedded && (
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-primary">Grace Assistant</h2>
                    {userRole && <p className="text-sm text-muted-foreground">Role: {userRole}</p>}
                </div>
            )}
            
            <Card className={'rounded-3xl w-full'}>
                <CardContent className="p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className={'text-center'}>
                            {isConnected ? (
                                isSpeaking ? `Agent is speaking` : 'Agent is listening'
                            ) : (
                                'Tap to start'
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className={'flex flex-col gap-y-4 text-center'}>
                        <div 
                            className={cn('orb my-16 mx-auto',
                                isSpeaking ? 'animate-orb' : (isActive && 'animate-orb-slow'),
                                isConnected ? 'orb-active' : 'orb-inactive')}
                            onClick={toggleSpeaking}
                        >
                            <div className="orb-inner-waves"></div>
                        </div>
                        
                        {!isActive ? (
                            <Button
                                variant={'default'}
                                className={'rounded-full bg-purple-600 hover:bg-purple-700'}
                                size={"lg"}
                                disabled={isActive}
                                onClick={startConversation}
                            >
                                Start conversation
                            </Button>
                        ) : (
                            <Button
                                variant={'outline'}
                                className={'rounded-full'}
                                size={"lg"}
                                disabled={!isActive}
                                onClick={endConversation}
                            >
                                End conversation
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Footer text */}
            <div className="text-center text-sm text-muted-foreground mt-2">
                <p>Powered by Fellowship360</p>
            </div>
        </div>
    )
}
