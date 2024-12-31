type ServiceTrackingParam = {
    service: string;
    params: {
        key: string;
        value: string;
    }[];
};

type ConsistencyTokenJar = {
    encryptedTokenJarContents: string;
    expirationSeconds: string;
};

type MainAppWebResponseContext = {
    datasyncId: string;
    loggedOut: boolean;
    trackingParam: string;
};

type WebResponseContextExtensionData = {
    hasDecorated: boolean;
};

type ResponseContext = {
    serviceTrackingParams: ServiceTrackingParam[];
    consistencyTokenJar: ConsistencyTokenJar;
    mainAppWebResponseContext: MainAppWebResponseContext;
    webResponseContextExtensionData: WebResponseContextExtensionData;
};

type GuideEntryRenderer = {
    navigationEndpoint: {
        clickTrackingParams: string;
        commandMetadata: {
            webCommandMetadata: {
                url: string;
                webPageType: string;
                rootVe: number;
                apiUrl: string;
            };
        };
        browseEndpoint: {
            browseId: string;
        };
    };
    icon: {
        iconType: string;
    };
    trackingParams: string;
    formattedTitle: {
        simpleText: string;
    };
    entryData: {
        guideEntryData: {
            guideEntryId: string;
        };
    };
};

type AddToGuideSectionAction = {
    handlerData: string;
    items: {
        guideEntryRenderer: GuideEntryRenderer;
    }[];
};

type NotificationActionRenderer = {
    responseText: {
        runs: {
            text: string;
        }[];
    };
    trackingParams: string;
};

type OpenPopupAction = {
    popup: {
        notificationActionRenderer: NotificationActionRenderer;
    };
    popupType: string;
};

type RunAttestationCommand = {
    ids: {
        playlistId: string;
        externalChannelId: string;
    }[];
    engagementType: string;
};

type ShowEngagementPanelEndpoint = {
    identifier: {
        tag: string;
    };
    globalConfiguration: {
        initialState: {
            engagementPanelSectionListRenderer: {
                header: {
                    engagementPanelTitleHeaderRenderer: {
                        title: {
                            runs: {
                                text: string;
                            }[];
                        };
                        visibilityButton: {
                            buttonRenderer: {
                                style: string;
                                size: string;
                                isDisabled: boolean;
                                icon: {
                                    iconType: string;
                                };
                                trackingParams: string;
                                accessibilityData: {
                                    accessibilityData: {
                                        label: string;
                                    };
                                };
                                command: {
                                    clickTrackingParams: string;
                                    changeEngagementPanelVisibilityAction: {
                                        targetId: string;
                                        visibility: string;
                                    };
                                };
                            };
                        };
                        trackingParams: string;
                    };
                };
                content: {
                    contentLoadingRenderer: {
                        useSpinner: boolean;
                    };
                };
                veType: number;
                targetId: string;
                identifier: {
                    tag: string;
                };
            };
        };
        params: string;
    };
    engagementPanelPresentationConfigs: {
        engagementPanelPopupPresentationConfig: {
            popupType: string;
        };
    };
};

type Action = {
    clickTrackingParams: string;
    addToGuideSectionAction?: AddToGuideSectionAction;
    openPopupAction?: OpenPopupAction;
    runAttestationCommand?: RunAttestationCommand;
    showEngagementPanelEndpoint?: ShowEngagementPanelEndpoint;
};

export type PlaylistCreateResponse = {
    responseContext: ResponseContext;
    playlistId: string;
    actions: Action[];
    trackingParams: string;
};