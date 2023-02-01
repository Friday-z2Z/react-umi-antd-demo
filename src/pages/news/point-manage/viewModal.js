import { BaseModal, DPlayer } from '@/components';

export default function(props) {
    const { data: { cameraName = '', flvUrl = '' } } = props
    return (
        <BaseModal {...props} width={800} title={cameraName} destroyOnClose footer={null}>
            <DPlayer 
                id="flv-player"
                live={true}
                video={{
                    url: flvUrl,
                }} 
                style={{width: '100%', height: '100%'}} 
            />
        </BaseModal>
    );
}
