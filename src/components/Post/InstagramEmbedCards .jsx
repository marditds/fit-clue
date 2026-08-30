import { useCallback, useState } from 'react';
import { useInstagramEmbedLoader } from '../../lib/hooks/useInstagramEmbedLoader';
import { devError } from '../../lib/utils/devConsole';
import { Card } from '../Card/Card';

export const InstagramEmbedCards = ({
    posts,
    saveDocId,
    tag,
    onDeleteSaveClick,
    isDeleteSaveLoading
}) => {

    const [unavailablePostIds, setUnavailablePostIds] = useState(
        new Set()
    );

    const handleInstagramUnavailable = useCallback((postId) => {
        setUnavailablePostIds((currentIds) => {
            if (currentIds.has(postId)) {
                return currentIds;
            }

            const updatedIds = new Set(currentIds);
            updatedIds.add(postId);

            return updatedIds;
        });
    }, []);

    useInstagramEmbedLoader(
        [posts.length],
        handleInstagramUnavailable
    );

    return (
        <>
            {
                posts.map((post) => {

                    const id = post?.$id;
                    const rawUrl = post?.url;
                    const personalityName = post?.personality_name;
                    const productNames = post?.product_names;
                    const userNote = post?.user_note;

                    let iUrl = null;

                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname
                            .split('/')
                            .filter(Boolean);

                        const postIndex =
                            parts.indexOf('p') !== -1
                                ? parts.indexOf('p')
                                : parts.indexOf('reel');

                        if (
                            postIndex !== -1 &&
                            parts[postIndex + 1]
                        ) {
                            const postId = parts[postIndex + 1];

                            iUrl =
                                `https://www.instagram.com/${parts[postIndex]}/${postId}/`;
                        }
                    } catch (e) {
                        devError('Invalid URL:', rawUrl);
                    }

                    return (
                        <Card
                            key={id}
                            id={id}
                            personalityName={personalityName}
                            productNames={productNames}
                            userNote={userNote}
                            iUrl={iUrl}
                            isInstagramUnavailable={
                                unavailablePostIds.has(id)
                            }
                            saveDocId={saveDocId}
                            tag={tag}
                            onDeleteSaveClick={onDeleteSaveClick}
                            isDeleteSaveLoading={isDeleteSaveLoading}
                        />
                    );
                })
            }
        </>
    );
};