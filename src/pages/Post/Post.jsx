import { useState, useEffect } from "react";
import { usePosts } from "../../lib/hooks/usePosts";

const Post = () => {

    const { fetchPosts } = usePosts();

    const [post, setPost] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const p = await fetchPosts();
            setPost(p[16]?.post?.embed_code);
        }
        getPosts();
    }, [])

    useEffect(() => {
        console.log('post:', post);
    }, [post])

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);
    }, []);


    return (
        <div>
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={post}
                data-instgrm-version="14"
                style={{
                    background: "#FFF",
                    border: 0,
                    borderRadius: "3px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "1px",
                    maxWidth: "540px",
                    minWidth: "326px",
                    padding: 0,
                    width: "calc(100% - 2px)"
                }}
            >
                <div style={{ padding: "16px" }}>
                    <a
                        href={post}
                        style={{
                            background: "#FFFFFF",
                            lineHeight: 0,
                            padding: "0 0",
                            textAlign: "center",
                            textDecoration: "none",
                            width: "100%"
                        }}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div style={{ paddingTop: "8px" }}>
                            <div
                                style={{
                                    color: "#3897f0",
                                    fontFamily: "Arial,sans-serif",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: 550,
                                    lineHeight: "18px"
                                }}
                            >
                                View this post on Instagram
                            </div>
                        </div>
                    </a>
                    <p
                        style={{
                            color: "#c9c8cd",
                            fontFamily: "Arial,sans-serif",
                            fontSize: "14px",
                            lineHeight: "17px",
                            marginBottom: 0,
                            marginTop: "8px",
                            overflow: "hidden",
                            padding: "8px 0 7px",
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    >
                        <a
                            href={post}
                            style={{
                                color: "#c9c8cd",
                                fontFamily: "Arial,sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                lineHeight: "17px",
                                textDecoration: "none"
                            }}
                            target="_blank"
                            rel="noreferrer"
                        >
                            A post shared by 🌙 Ariana Madix 🌙 (@arianamadix)
                        </a>
                    </p>
                </div>
            </blockquote>
        </div>
    );
};

export default Post;
