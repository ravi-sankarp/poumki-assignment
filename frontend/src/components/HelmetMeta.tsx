import { Helmet } from 'react-helmet';

function HelmetMeta({
  title,
  description,
  keywords
}: {
  title: string;
  description?: string;
  keywords?: string;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keyword"
        content={keywords}
      />
    </Helmet>
  );
}
HelmetMeta.defaultProps = {
  description: 'Poumki Assignment',
  keywords: 'login,register,realtime,admin,user'
};

export default HelmetMeta;
