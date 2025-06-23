// BlogDetailTwo component extracted from page.tsx
'use client'


//added later to make as client component because of the use of useSearchParams
export const dynamic = 'force-dynamic';



import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuOne from '@/components/Header/Menu/MenuOne';
import blogData from '@/data/Blog.json';
import NewsInsight from '@/components/Home3/NewsInsight';
import Footer from '@/components/Footer/Footer';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Rate from '@/components/Other/Rate';
import Image from 'next/image';
import Link from 'next/link';

const BlogDetailTwo = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    let blogId = searchParams.get('id');
    if (blogId === null) {
        blogId = '14';
    }
    const blogMain = blogData[Number(blogId) - 1];
    const handleBlogClick = (category: string) => {
        router.push(`/blog/default?category=${category}`);
    };
    const handleBlogDetail = (id: string) => {
        router.push(`/blog/detail2?id=${id}`);
    };
    return (
        // ...existing code from inside the return of BlogDetailTwo...
        <>
            {/* ...all the JSX from your previous BlogDetailTwo return... */}
        </>
    );
};

export default BlogDetailTwo;
