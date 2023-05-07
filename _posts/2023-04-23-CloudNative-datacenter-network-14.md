---
layout: post
title:  Cloud Native Datacenter Network Chapter 14
date:   2023-04-23 00:00:00 +0930
categories: Network
---
# Chapter14. BGP in Data Center

BGP is respected but also greatly feared.

BGP has evolved into
- a sophisticated, mature, rich routing protocol
- still responsible for peicing together the internet as we know it today.
- morphed to support new ideas such as SDN controllers.

## Basic BGP Concepts
BGP is
- path vector routing protocol
    - A vector := an array or list of objects
    - Thus, path vector routing protocol is one that builds and distributes **a vector of objects.**
        - objects here : not router. something called **AS**.
- BGP runs over **TCP**.
    - BGP ignore problem such as framentation, reassemply, handling acknowledgments, retransmission, and other such issues that other routing protocols typically deal with.
- BGP is **the only routing protocol that runs over TCP.**
    - Every other common protocol either runs on IP, or even further below(L2).
    - BGP accepts new connections and sends connect request to TCP port number 179.
- BGP is **multiprotocol routing protocol**
    - BGP peers excange routing information for multiple network types
        - IPv4
        - IPv6
        - newtwork virtualization (MPLS, VXLAN)
- BGP supports the ability to apply complex routing policies
    - BGP exchanges routing information accross ADMIN domain.
    - routing policies govern multple aspects of BGP's behavior.
        - computing the best path to reach
            - a destination
            - the routes that are advertised
            - the attributes they're advertised with.
        - supports ECMP, UCMP.
- eBGP : BGP peering between speakers in different ADMIN domains(or AS)
- iBGP : BGP peering between speakers within an ADMIN domains (or within same AS)
- BGP is extensible protocol.
    - BGP can be used as the HTTP protocol for routing developers.
    - BGP can be used to carry all kinds of information between routers
    - IT'S CRUICIAL TO USE **MINIMALISTIC** IN THE USE OF BGP. **DON'T USE SOMETHING JUST BECAUSE YOU CAN.**

## BGP Peering
- BGP is Peer to Peer relationship.
    - This is a sample timeline sequence in the life of a BGP peering session.
        ![a sample timeline sequence in the life of a BGP peering session](/assets/img/20230423/1.jpeg)
    - Connection Collision
        - P2P이기 때문에, BGP connection은 Peer A peer B 모두 TCP connection을 initiate 할 수 있으며, 이런 시도는 보통 성공한다. 이렇게 되면 Peer A Peer B 둘 다 모두 별개의 TCP connection을 가지게 되며, 이런 상태를 BGP Standard에서는 Connection Collision이라 부른다.
        - BGP reduces these two TCP connection to a single TCP connections by resolving collision.
        - The winning TCP connection is the one initiated by the speaker with th higher router-id
            - router-id : 32bit uint. unique identifier oof the BGP speaker.
        - BGP에는 session init간 priority field를 정의하지 않는데, BGP의 decision making에는 어떤 connection session이 선택되었는지는 중요하지 않기 때문이다.
    - passive connection
        - one side never initiates the TCP connection but just responds when another node requests a connection.
        - Kube-router 또는 이와 유사한 솔루션을 실행하는 엔드포인트가 라우터에서 실행 중인 BGP와 연결하는 경우에 사용됩니다. 
            - (chatgpt) 이러한 솔루션은 Kubernetes 클러스터 내의 엔드포인트와 라우터 간의 BGP 연결을 수립하여 라우팅 정보를 교환하게 됩니다. 이를 통해 Kubernetes 클러스터 내부와 외부 네트워크 간의 통신을 보다 효율적으로 관리할 수 있습니다.
        
## BGP State Machine
BGP State Machine Consist of three main phases
- TCP connection extablishment
    - Connect
    - Active(에러시 Idle)
- the emlimination of connection collision along with capability exchange.
    - OpenSent(에러시 Active, Idle)
    - OpenConfirm(에러시 Idle)
- route exchange
    - Established

## Autonomous System Number
ASN Number
- identifies the organization
- represented by speaker.

In Context of BGP, an **organization** is defined as **network that is controlled by a single-entity** and has a well defined routing policy.
- Typically service providers are assigned a uinque ASN
- major enterprise 또한 unique ASN을 받는다.(여러개일 수 있음. 애플은 3개, 아마존은 14개)

**The path vector of a network address** is **the list of ASN** traversed by that address.
- used to 
    - identify routing loops
    - determine the best path to a prefix
        - each ASN is allowed to speak authoritatively(권위있게) about only particular IP prefixes.
    - associate routing policies with networks

ASNs come in two variations
- two byte
    - more popular
        - 더 오래 존재해 왔기 떄문.
        - 더 읽기 편하기 때문. 
- four byte
- 요즘 라우팅 프로토콜은 두 variation을 모두 지원함.

## BGP Capabilities
BGP allows the negotiation of capabilities on every peering session
- to ensure that the two sides exchange only information that is supported by both sides.
- BGP is a continuously evolving protocol이기 때문에 이런 기능을 지원한다고 한다.
- BGP Open Message에서 교환되는 capability의 종류에는 각 side에서 어떤 address family를 포함하는지와 같은 정보가 포함된다.


(Network capabilities refer to short-term authorizations that a sender obtains from a receiver and stamps on its packets to the receiver.)

## BGP Attributes, Communities, Extended Communities
### BGP Attribute
BGP route advertisements carry little Post-it notes
- Post-it notes : BGP path attributes
    - there are different kinds of attributes
        - depending on 
            - their(BGP path attributes) use
            - their(BGP path attributes) semantics
        - Attributes are encoded using the well-knwon Type, Length, and Value(TLV) model.
- There are 7 path attributes that every compliant and implemnetation must support.(BGP-4 RFC defines)
    - These attributes are used in BGP's best path communication.
    - (for example)
         - one of the attribute - AS_PATH is what carries the path vector associated with a route.
- Some attributes are mandatory
    - in other words,
        - they mus be always transmitted, whereas others might not always apper in a message.
    - if any of the seven base path attributes is present, the receipient must be able to process it.
- Other attribute defined outside the base RFC are aclled optional attributes.
    - Not all implementation supprot this.
    - (for example)
        - MP-REACH_NLRI : used to advertise MPLS labels.
        - but not all implementaions need to support this.
    - The only requirment for a reciever to process an operational attribute
        - is to forward an attributed flagged as transitive.
### BGP Community
BGP community is an attribute that
- allows user-extensible grouping of routes
- transitive optional attribute
- used by operators to group togeter a set of advertised routes to apply a routing policy to.
    - A routing policy influences 
        - the semantics of BGP Update message processing
        - best path computation for those routes.

Operators can use configuration commands specific to their routing stack
- to configure the tagging of routes with communities
- to influence BGP's behavior based on the value of a community.

(the routing stack refers to protocols that exchange routing information between network nodes, so that each node has the required information about the network topology. )

Community는 보통 4바이트의 Value이다.(not arbitary string)
- first two byte : ASN of BGP speaker.
- last : 아무렇게나 쓸 수 있는 값.
- community는 아주 초기에 나온 값으로, 4byte ASN과 2byte 이상의 operator shuffling의 필요로 인해, extended community(8byte), large community(12byte)가 나왔다.

## BGP Best-Path Computation
A BGP router computes the best path for each advertised path starting from itself.

BGP's best path selection is triggered when a new UPDATE message is received from one or more of its peers.
> (Implementation detail : can choose to buffer the triggering of this computation so that a single run will process all updates instead of triggering rabid route updates)

BGP advertises a route only if the computation changes the best path for a given network destination.

BGP has eight metric by which to decide the specific path to accept.
- OSPF, ISIS have a simple metric.(one)
- mnemonic prhase : Wise Lip Lovers Apply Oral Medication Every Night
    - Wise : Wegith
    - Lip : LOCAL_PREFERENCE
    - Lovers : Locally originated
    - Apply : AS_PATH
    - Oral : ORIGIN
    - Medication : MED
    - Every : eBGP over iBGP
    - Night : Nexthop IGP Cost
- The Best Path is consdered one that is better in the value of the metric in the order specified.(c언어 strcmp 마냥 비교하는것으로 보임)
    - If the values are equal for a metric between a new update and the existing best path, the next metric is compared to break the tie.
- in the data center, only two of these metrics are used
    - locally originated
    > a prefix that a local to a node is preferred to one learned via BGP
    - AS_PATH
    > a shorter AS_PATH route is preferred over a route with a longer AS_PATH length.
    
    > if AS_PATH lengths ar equal, the paths are considered equal cost.

## Support for Multiple Protocols
BGP can advertise
- how to reach IP address
- MPLS labels
- MAC address
- etc..(RFC 4760)

Each Network protocol supported by BGP has its own identifier, called the AFI(Address Family Identifier).
- AFI identifies the primary network protocol.

SAFI(Subsequent Address Family Identifier) : even within an AFI, there is a need for further distinctions.
- unicast or multicast.

THE AFI/SAFI list that is of interest to a BGP speaker is advertised using BGP capabilities in the BGP OPEN message.

Two BGP peers exchange information about a network address onlyu if both sides advertise an interest in its AFI/SAFI.

## BGP Messages
| Message Type | Use | Periodicity |
|---|------------|---|
| Open | Sent on session establishment to identify router and exchange capabilities  | Once |
| Update | Used to exchange route advertisement and withdrawal | Only when information changes |
| Keepalive | Heartbeat, used to signal the remote peer that we're alive and kicking | Configured, usually 60 seconds |
| Notification | Sent on error or when administratively closing the session | On error or close | 
| Route Refresh | Request remote peer toresend all the routes | Only as needed |

- Each BGP message is encoded as a TLV.
- BGP message에는 fixed header가 있으며, 거기에 BGP message의 Type이 적혀있다.
- BGP message에서 가장 많이 쓰이는 놈은(workhorse) Update이다. 이놈은 advertised route의 list와 거기서 뽑아낸 route의 리스트를 포함하는 놈이다.
    - BGP는 다른 프로토콜과 다르게 explicit withdraw mechanism을 가지고 있다는 것이 특징이다.
    - (다른 프로토콜, OSPF ISIS) : link-state information에서 aging out되는 정보를 implicit하게 withdraw함.
- NLRI : Network Layer Reachability Information
    - means the advertised routes.
- Communities are encoded in "Path Attribute List"

## Adapting BGP to the DataCenter
BGP's usage in the data center can be summarized as follows
- eBGP is used as the sole routing protocol
- eBGP is used with private ASNs
- BGP's ASN numbering scheme must be such that you don't run into BGP's path hunting problem
- BGP's timers are adapted to update more aggresively than in service provider networks.
