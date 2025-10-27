import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: string;
  title_ja: string;
  title_zh: string;
  content_ja: string;
  content_zh: string;
  image_url: string;
  publish_date: string;
  created_at: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPost();
    fetchRelatedPosts();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('is_visible', true)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_visible', true)
        .is('deleted_at', null)
        .neq('id', id)
        .order('publish_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ja' 
      ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      : `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('読み込み中...', '加载中...')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('記事が見つかりません', '未找到文章')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            {t('ホームに戻る', '返回首页')}
          </button>
        </div>
      </div>
    );
  }

  const title = language === 'ja' ? post.title_ja : post.title_zh;
  const content = language === 'ja' ? post.content_ja : post.content_zh;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* ブレッドクラム */}
        <div className="container mx-auto px-4 mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">
              {t('ホーム', '首页')}
            </Link>
            <span>/</span>
            <Link to="/#results" className="hover:text-primary transition-colors">
              {t('施工事例・ニュース', '施工案例・新闻')}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </nav>
        </div>

        {/* メインコンテンツ */}
        <article className="container mx-auto px-4 max-w-4xl">
          {/* 記事ヘッダー */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {post.image_url && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={post.image_url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>
              
              <div className="flex items-center space-x-6 text-gray-600 text-sm mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publish_date}>
                    {formatDate(post.publish_date)}
                  </time>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{language === 'ja' ? '日本語' : '中文'}</span>
                </div>
              </div>

              {/* 記事本文 */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>

          {/* 戻るボタン */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/#results')}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('一覧に戻る', '返回列表')}</span>
            </button>
          </div>

          {/* 関連記事 */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('関連記事', '相关文章')}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden transition-transform hover:scale-105">
                      {relatedPost.image_url && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={relatedPost.image_url}
                            alt={language === 'ja' ? relatedPost.title_ja : relatedPost.title_zh}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(relatedPost.publish_date)}
                        </p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {language === 'ja' ? relatedPost.title_ja : relatedPost.title_zh}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
