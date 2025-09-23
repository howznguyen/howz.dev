import React, { Fragment } from "react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Header, Footer } from "@/components/organisms";
import Head from "next/head";
import { PageMeta } from "@/types";

interface BaseLayoutProps {
  children: React.ReactNode;
  meta?: PageMeta;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  navigation?: any;
  settings?: any;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  meta,
  className = "",
  showHeader = true,
  showFooter = true,
  navigation,
  settings,
}) => {
  return (
    <ErrorBoundary>
      {meta && (
        <Head>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          {meta.image && <meta property="og:image" content={meta.image} />}
          {meta.url && <meta property="og:url" content={meta.url} />}
          <meta property="og:type" content={meta.type || "website"} />
          {meta.author && <meta name="author" content={meta.author} />}
          {meta.publishedTime && (
            <meta
              property="article:published_time"
              content={meta.publishedTime}
            />
          )}
          {meta.modifiedTime && (
            <meta
              property="article:modified_time"
              content={meta.modifiedTime}
            />
          )}
          {meta.tags && meta.tags.length > 0 && (
            <Fragment>
              {meta.tags.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
              ))}
            </Fragment>
          )}
        </Head>
      )}

      <div className={`min-h-screen bg-white dark:bg-dark ${className}`}>
        {showHeader && (
          <div className="w-full py-2 sticky top-0 z-50 transition-shadow shadow-sm bg-white dark:bg-dark mb-2">
            <div className="layout">
              <Header settings={settings} navigation={navigation} />
            </div>
          </div>
        )}

        <ErrorBoundary>
          <main className={showHeader ? "" : "pt-0"}>{children}</main>
        </ErrorBoundary>

        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

interface MainLayoutProps
  extends Omit<BaseLayoutProps, "showHeader" | "showFooter"> {}

export const MainLayout: React.FC<MainLayoutProps> = (props) => (
  <BaseLayout {...props} showHeader={true} showFooter={true} />
);

interface NoNavLayoutProps
  extends Omit<BaseLayoutProps, "showHeader" | "navigation" | "settings"> {}

export const NoNavLayout: React.FC<NoNavLayoutProps> = (props) => (
  <BaseLayout {...props} showHeader={false} showFooter={true} />
);

interface FullScreenLayoutProps
  extends Omit<BaseLayoutProps, "showHeader" | "showFooter"> {}

export const FullScreenLayout: React.FC<FullScreenLayoutProps> = (props) => (
  <BaseLayout {...props} showHeader={false} showFooter={false} />
);

// Blog specific layouts
interface BlogLayoutProps extends MainLayoutProps {
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  sidebar,
  showSidebar = false,
  ...props
}) => (
  <MainLayout {...props}>
    <div className="layout">
      {showSidebar ? (
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">{children}</div>
          {sidebar && (
            <div className="lg:col-span-1">
              <aside className="sticky top-20">{sidebar}</aside>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  </MainLayout>
);

interface PostLayoutProps extends BlogLayoutProps {
  tableOfContents?: React.ReactNode;
  relatedPosts?: React.ReactNode;
}

export const PostLayout: React.FC<PostLayoutProps> = ({
  children,
  tableOfContents,
  relatedPosts,
  ...props
}) => (
  <BlogLayout
    {...props}
    showSidebar={!!tableOfContents}
    sidebar={tableOfContents}
  >
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {children}
    </article>
    {relatedPosts && (
      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        {relatedPosts}
      </section>
    )}
  </BlogLayout>
);

// HOC for adding layouts to pages
export function withLayout<P extends object>(
  LayoutComponent: React.FC<any>,
  layoutProps?: any
) {
  return function WrappedComponent(PageComponent: React.FC<P>) {
    const WithLayoutComponent = (props: P) => (
      <LayoutComponent {...layoutProps}>
        <PageComponent {...props} />
      </LayoutComponent>
    );

    WithLayoutComponent.displayName = `withLayout(${
      PageComponent.displayName || PageComponent.name
    })`;

    return WithLayoutComponent;
  };
}

// Predefined layout HOCs
export const withMainLayout = withLayout(MainLayout);
export const withNoNavLayout = withLayout(NoNavLayout);
export const withBlogLayout = (props?: Partial<BlogLayoutProps>) =>
  withLayout(BlogLayout, props);
export const withPostLayout = (props?: Partial<PostLayoutProps>) =>
  withLayout(PostLayout, props);
