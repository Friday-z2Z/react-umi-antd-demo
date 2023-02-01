import React from 'react';
import { DatePicker } from 'antd';

class YearPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        };
    }

    handlePanelChange = (value) => {
        this.setState({
            isOpen: false
        })
        this.props.onPanelChange && this.props.onPanelChange(value)
    }

    clearValue = () => {
        this.props.onPanelChange && this.props.onPanelChange(null)
    }

    render() {
        const { isOpen } = this.state;
        return (
            <DatePicker
                {...this.props}
                mode="year"
                open={isOpen}
                placeholder="请选择年份"
                format="YYYY"
                onOpenChange={status => {
                    if (status) {
                        this.setState({ isOpen: true });
                    } else {
                        this.setState({ isOpen: false });
                    }
                }}
                onPanelChange={this.handlePanelChange}
                onChange={this.clearValue}
            />
        );
    }
}

export default YearPicker;
