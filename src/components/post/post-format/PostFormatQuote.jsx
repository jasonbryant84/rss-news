import WidgetAd from "../../widget/WidgetAd";
import WidgetInstagram from "../../widget/WidgetInstagram";
import WidgetNewsletter from "../../widget/WidgetNewsletter";
import WidgetPost from "../../widget/WidgetPost";
import MetaDataFour from "./elements/meta/MetaDataFour";
import PostAuthor from "./elements/PostAuthor";

const PostFormatQuote = ({ postData, allData }) => {
  const basePathLink = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH ?? "" : "";
  
  const postContent = postData.content.replaceAll('/images/', basePathLink + '/images/');
  return (
    <>
      <div className="post-single-wrapper p-t-xs-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <main className="site-main">
                <article className="post-details">
                  <div className="single-blog-wrapper">
					<MetaDataFour metaData={postData} />
                    <div
                      dangerouslySetInnerHTML={{ __html: postContent }}
                    ></div>
                  </div>
                </article>
                <hr className="m-t-xs-50 m-b-xs-60" />
                <PostAuthor authorData={postData} />
              </main>
            </div>
            <div className="col-lg-4">
              <div className="post-sidebar">
                <WidgetAd />
                <WidgetNewsletter />
                <WidgetPost dataPost={allData} />
                <WidgetInstagram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostFormatQuote;
