import { Descriptions } from 'antd';
import { BaseModal } from '@/components';
import { filter } from '@/utils/tool'

export default function(props) {
    const {
        data: {
            tollName,
            rampInNum,
            roadName,
            rampOutNum,
            cityName,
            laneInNum,
            longitude,
            laneOutNum,
            latitude,
            cameraNum,
            leader,
            phone,
            collectorNum,
        },
    } = props;
    return (
        <BaseModal {...props} width={800} title="基础信息" destroyOnClose footer={null}>
            <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="收费站名称">{filter(tollName)}</Descriptions.Item>
                <Descriptions.Item label="入口匝道数">{filter(rampInNum, '个')}</Descriptions.Item>
                <Descriptions.Item label="所属路段">{filter(roadName)}</Descriptions.Item>
                <Descriptions.Item label="出口匝道数">{filter(rampOutNum, '个')}</Descriptions.Item>
                <Descriptions.Item label="所属地市">{filter(cityName)}</Descriptions.Item>
                <Descriptions.Item label="入口收费车道数">{filter(laneInNum, '个')}</Descriptions.Item>
                <Descriptions.Item label="收费站经度">{filter(longitude)}</Descriptions.Item>
                <Descriptions.Item label="出口收费车道数">{filter(laneOutNum, '个')}</Descriptions.Item>
                <Descriptions.Item label="收费站纬度">{filter(latitude)}</Descriptions.Item>
                <Descriptions.Item label="摄像机点位">{filter(cameraNum, '个')}</Descriptions.Item>
                <Descriptions.Item label="站点负责人">{filter(leader)}</Descriptions.Item>
                <Descriptions.Item label="负责人电话">{filter(phone)}</Descriptions.Item>
                <Descriptions.Item label="收费人员">{filter(collectorNum, '个')}</Descriptions.Item>
            </Descriptions>
        </BaseModal>
    );
}
