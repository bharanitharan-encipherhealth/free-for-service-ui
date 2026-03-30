import { Empty } from 'antd'
import React from 'react'

const EmptyComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-10" style={{ height: "70vh" }}>
      <Empty
        description={
          "Customize Your Dashboard, Click the Dashboard Customization Button."
        }
      />
    </div>
  )
}

export default EmptyComponent;
