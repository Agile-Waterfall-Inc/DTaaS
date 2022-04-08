import { CloudUploadIcon, DotsHorizontalIcon, PencilIcon, PlusIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import ReactFlow, { useNodesState, MiniMap, Controls, Node as ReactFlowNode, Edge as ReactFlowEdge, useEdgesState, addEdge, updateEdge } from 'react-flow-renderer/nocss'
import { EditDataFlowDialog } from '../../components/flow/edit-dialog'
import { Button } from '../../components/form/button'
import { FilterNode } from '../../components/graph/filter-node'
import { HttpInputNode } from '../../components/graph/http-input-node'
import { HttpOutputNode } from '../../components/graph/http-output-node'
import { ScriptNode } from '../../components/graph/script-node'
import { Message, MessageType } from '../../components/message'
import { PageTitle } from '../../components/page-title'
import { toFlooqEdge, toReactFlowEdge } from '../../helper/edges'

const Background = dynamic( () => import( 'react-flow-renderer/nocss' ).then( ( mod ): any => mod.Background ), { ssr: false } )

const nodeTypes = {
  httpIn: HttpInputNode,
  httpOut: HttpOutputNode,
  filter: FilterNode,
  script: ScriptNode
}

const DataFlowOverview = ( { dataFlow }: any ): JSX.Element => {
  const [flow, setFlow] = useState( dataFlow )
  const [isSaveDisabled, setIsSaveDisabled] = useState( false )
  const [isSaving, setIsSaving] = useState( false )
  const [message, setMessage] = useState<Message>()
  const [isEditOpen, setIsEditOpen] = useState( false )

  const router = useRouter()

  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode[]>( flow.nodes )
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge[]>( flow.edges )

  const onConnect = useCallback(
    ( connection ) => setEdges( ( eds: any ) => addEdge( { ...connection, animated: true }, eds ) ),
    [setEdges]
  )

  const onEdgeUpdate = ( oldEdge: any, newConnection: any ): any => setEdges( ( els ) => updateEdge( oldEdge, newConnection, els ) )

  const save = async (): Promise<void> => {
    setIsSaving( true )
    setIsSaveDisabled( true )

    try {
      const response = await fetch( '/api/flows/save', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          ...flow,
          definition: JSON.stringify( {
            nodes,
            edges: edges.map( toFlooqEdge )
          } )
        } )
      } )

      if ( !response.ok ) {
        throw await response.text()
      }

      setMessage( { text: 'Saved Data Flow', type: MessageType.Info } )
    } catch ( e: any ) {
      setMessage( { text: e?.toString(), type: MessageType.Error } )
    } finally {
      setIsEditOpen( false )
      setIsSaving( false )
      setIsSaveDisabled( false )
      setTimeout( () => {
        setMessage( undefined )
      }, 1500 )
    }
  }

  const deleteFlow = async (): Promise<void> => {
    const response = await fetch( `/api/flows/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( flow )
    } )
    if ( response.ok ) {
      router.push( '/' )
    }
  }

  const addNode = (): void => {
    // TODO: Remove this once the
    const newNode: ReactFlowNode = {
      id: 'id-' + Date.now(),
      dragHandle: '.custom-drag-handle',
      type: 'script',
      data: {
        title: 'Script',
        input: {
          function: 'async () => {\n  return\n}'
        },
        incomingHandles: [],
        outgoingHandles: [{ 'id': 'out', 'name': 'out' }]
      },
      position: { 'x': randomIntFromInterval( -100,100 ), 'y': randomIntFromInterval( -100,100 ) }
    }

    setNodes( [
      ...nodes,
      newNode
    ] )
  }

  const randomIntFromInterval = ( min: number, max: number ): number => {
    return Math.floor( Math.random() * ( max - min + 1 ) + min )
  }

  return (
    <>
      <Head>
        <title>Flooq | {flow.name}</title>
      </Head>
      <PageTitle name={flow.name} message={message}>
        <div className="flex gap-2 items-center">
          <Button onClick={addNode} secondary>
            <div className="flex gap-2 justify-between items-center">
              <PlusIcon className="w-5 h-5" />
              Add Node
            </div>
          </Button>
          <Button onClick={(): void => setIsEditOpen( true )} secondary>
            <div className="flex gap-2 justify-between items-center">
              <PencilIcon className="w-5 h-5" />
              Edit
            </div>
          </Button>
          <Button
            disabled={isSaveDisabled}
            onClick={save}
            primary
          >
            <div className="flex gap-2 justify-between items-center">
              {isSaving ? <DotsHorizontalIcon className="w-5 h-5" /> : <CloudUploadIcon className="w-5 h-5" />}
              Save
            </div>
          </Button>
        </div>
      </PageTitle>

      <EditDataFlowDialog
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        flow={flow}
        setFlow={setFlow}
        save={save}
        deleteFlow={deleteFlow}
      />

      <main>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          snapToGrid={true}
          snapGrid={[15, 15]}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </main>
    </>
  )
}

export const getServerSideProps = async ( context: any ): Promise<any> => {
  const res = await fetch( `${process.env.BASE_URL}/api/flows/${context.query.id}` )
  const flow = await res.json()

  if ( !res.ok ) {
    return {
      notFound: true
    }
  }

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      dataFlow: {
        ...flow,
        edges: flow.edges.map( toReactFlowEdge )
      }
    }
  }
}


export default DataFlowOverview
