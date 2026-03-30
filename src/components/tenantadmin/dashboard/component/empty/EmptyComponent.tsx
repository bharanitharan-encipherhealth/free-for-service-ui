import { Empty } from 'antd'
import React from 'react'

export default function EmptyComponent() {
  return (
    <div style={{ height: "75vh" }}>
    <Empty
      description={
        "Customize Your Dashboard, Click the Dashboard Customization Button."
      }
    />
  </div>
  )
}
