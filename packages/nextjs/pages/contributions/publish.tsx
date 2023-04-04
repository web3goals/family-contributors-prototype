import { useState } from "react";
import ContributionPublishForm from "~~/components/contribution/ContributionPublishForm";
import ContributionPublishedMessage from "~~/components/contribution/ContributionPublishedMessage";
import Layout from "~~/components/layout";

/**
 * Page to publish a contribution.
 */
export default function PublishContribution() {
  const [publishedContributionId, setPublishedContributionId] = useState<string | undefined>();

  return (
    <Layout maxWidth="sm">
      {publishedContributionId ? (
        <ContributionPublishedMessage id={publishedContributionId} />
      ) : (
        <ContributionPublishForm
          onSuccessPublish={publishedContributionId => {
            setPublishedContributionId(publishedContributionId);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </Layout>
  );
}
