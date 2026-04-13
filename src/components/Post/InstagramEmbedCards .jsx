import { useInstagramEmbedLoader } from '../../lib/hooks/useInstagramEmbedLoader';
import { Card } from '../Card/Card';

export const InstagramEmbedCards = ({ posts, saveDocId, onDeleteSaveClick, isDeleteSaveLoading }) => {

    useInstagramEmbedLoader([posts.length]);

    return (
        <>
            {
                posts.map((post) => {

                    const id = post?.$id;
                    const rawUrl = post?.url;
                    const personalityName = post?.personality_name;
                    let iUrl = null;

                    try {
                        const url = new URL(rawUrl);
                        const parts = url.pathname.split('/').filter(Boolean);
                        const postIndex = parts.indexOf('p') !== -1 ? parts.indexOf('p') : parts.indexOf('reel');
                        if (postIndex !== -1 && parts[postIndex + 1]) {
                            const postId = parts[postIndex + 1];
                            iUrl = `https://www.instagram.com/${parts[postIndex]}/${postId}/`;
                        }
                    } catch (e) {
                        console.error('Invalid URL:', rawUrl);
                    }
                    return (
                        <Card
                            key={id}
                            id={id}
                            personalityName={personalityName}
                            iUrl={iUrl}
                            saveDocId={saveDocId}
                            onDeleteSaveClick={onDeleteSaveClick}
                            isDeleteSaveLoading={isDeleteSaveLoading}
                        />
                    );
                })
            }
        </>
    )
}
