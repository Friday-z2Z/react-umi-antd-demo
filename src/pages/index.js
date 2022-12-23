import Redirect from 'umi/redirect';
import { connect } from 'dva';

function mapStateToProps({ menu }) {
    return {
        ...menu
    };
}

export default connect(mapStateToProps)(props => {
    const { flattenMenuData } = props
    return (
        <Redirect to={flattenMenuData[0] || {}} />
    )
})

