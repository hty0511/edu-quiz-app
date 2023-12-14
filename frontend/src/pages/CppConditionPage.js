import React from "react";
import Layout from "../layouts/Layout";
import IntroContent from "../components/IntroContent";
import WaitingContent from '../components/WaitingContent';
import Q1Content from "../components/Q1Content";
import Q1FeedbackContent from "../components/Q1FeedbackContent";
import Q1DiscussionContent from "../components/Q1DiscussionContent";
import Q2Content from "../components/Q2Content";
import Q3Content from "../components/Q3Content";

export default function CppConditionPage() {
  const [pageContent, setPageContent] = React.useState('intro');

  return (
    <Layout>
      {pageContent === 'intro' && <IntroContent setPageContent={setPageContent} />}
      {pageContent === 'waiting' && <WaitingContent setPageContent={setPageContent} />}
      {pageContent === 'q1' && <Q1Content setPageContent={setPageContent} />}
      {pageContent === 'q1-feedback' && <Q1FeedbackContent setPageContent={setPageContent} />}
      {pageContent === 'q1-discussion' && <Q1DiscussionContent setPageContent={setPageContent} />}
      {pageContent === 'q2' && <Q2Content setPageContent={setPageContent} />}
      {pageContent === 'q3' && <Q3Content setPageContent={setPageContent} />}
    </Layout>
  );
}
