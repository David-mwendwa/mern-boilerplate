import { Helmet } from 'react-helmet';

/**
 * @param {*} title 
 * @returns title metadata string
 * @invoke as JSX on the page component from which you want the title metadata updated i.e <MetaData title={product.name} />
 */
const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | <app-name>` : '🌐'}</title>
    </Helmet>
  );
};

export default MetaData;
