---
layout: post
title:  파드 및 컨테이너 리소스 관리
date:   2023-06-11 00:00:00 +0930
categories: Kubernetes
---

# 파드 및 컨테이너 리소스 관리
파드를 지정할 때, **컨테이너에** 필요한 **각 리소스**의 양을 선택적으로 지정할 수 있다.

리소스 종류는 다음과 같다.
- cpu
- memory
- hugepage
    - HugePages configuration allows a Pod to access memory pages larger than the Linux kernel’s default memory page size, which is usually 4 KB.
    - **Many memory-intensive applications**, like Elasticsearch and Cassandra, take advantage of using huge pages. 
    - (https://livebook.manning.com/concept/kubernetes/huge-page)

request와 limit을 걸 수 있다.
- 파드에서 컨테이너에 대한 리소스 요청(request) 을 지정하면, kube-scheduler는 이 정보를 사용하여 파드가 배치될 노드를 결정한다.
- 컨테이너에 대한 리소스 제한(limit) 을 지정하면, 
    - kubelet은 실행 중인 컨테이너가 설정한 제한보다 많은 리소스를 사용할 수 없도록 해당 제한을 적용한다.
    - kubelet은 컨테이너가 사용할 수 있도록 해당 시스템 리소스의 최소 요청 량을 예약한다.


## 요청 및 제한
파드가 실행 중인 노드에 사용 가능한 리소스가 충분하면, 컨테이너가 해당 리소스에 지정한 request 보다 더 많은 리소스를 사용할 수 있도록 허용된다.

그러나, 컨테이너는 리소스 limit 보다 더 많은 리소스를 사용할 수는 없다.
- 해당 컨테이너에 대해 4GiB의 memory 제한을 설정하면, kubelet(그리고 컨테이너 런타임)이 제한을 적용한다. 
- 런타임은 컨테이너가 구성된 리소스 제한을 초과하여 사용하지 못하게 한다. 
- 컨테이너의 프로세스가 허용된 양보다 많은 메모리를 사용하려고 하면, 시스템 커널은 메모리 부족(out of memory, OOM) 오류와 함께 할당을 시도한 프로세스를 종료한다.
- 제한은 반응적(시스템이 위반을 감지한 후에 개입)으로 또는 강제적(시스템이 컨테이너가 제한을 초과하지 않도록 방지)으로 구현할 수 있다. 런타임마다 다른 방식으로 동일한 제약을 구현할 수 있다.

## 리소스 타입
- CPU
    - CPU는 컴퓨팅 처리를 나타내며 쿠버네티스 CPU 단위로 지정된다. 
    - 단위
        - 쿠버네티스에서, 1 CPU 단위는 노드가 물리 호스트인지 아니면 물리 호스트 내에서 실행되는 가상 머신인지에 따라 1 물리 CPU 코어 또는 1 가상 코어 에 해당한다.
        - CPU 자원의 단위와 관련하여, 0.1 이라는 수량 표현은 "백 밀리cpu"로 읽을 수 있는 100m 표현과 동일하다.
        - CPU 리소스는 항상 리소스의 절대량으로 표시되며, 상대량으로 표시되지 않는다. 예를 들어, 컨테이너가 싱글 코어, 듀얼 코어, 또는 48 코어 머신 중 어디에서 실행되는지와 상관없이 500m CPU는 거의 같은 양의 컴퓨팅 파워를 가리킨다.
        - 쿠버네티스에서 CPU 리소스를 1m보다 더 정밀한 단위로 표기할 수 없다. 

- Memory
    - 메모리는 바이트 단위로 지정된다.
    - 단위
        - E, P, T, G, M, k 와 같은 수량 접미사 중 하나를 사용하여 메모리를 일반 정수 또는 고정 소수점 숫자로 표현할 수 있다. 
        - Ei, Pi, Ti, Gi, Mi, Ki와 같은 2의 거듭제곱을 사용할 수도 있다. 
        - 접미사의 대소문자에 유의한다. 
- Huge Page
    - for linux workload
    - 노드 커널이 기본 페이지 크기보다 훨씬 큰 메모리 블록을 할당하는 리눅스 관련 기능이다.
    - hugepages-* 리소스를 오버커밋할 수 없다. 

## 파드와 컨테이너의 리소스 요청 및 제한 
각 컨테이너에 대해, 다음과 같은 리소스 제한(limit) 및 요청(request)을 지정할 수 있다.
- spec.containers[].resources.limits.cpu
- spec.containers[].resources.limits.memory
- spec.containers[].resources.limits.hugepages-<size>
- spec.containers[].resources.requests.cpu
- spec.containers[].resources.requests.memory
- spec.containers[].resources.requests.hugepages-<size>

특정 리소스 종류에 대해, 파드 리소스 요청/제한 은 파드의 각 컨테이너에 대한 해당 타입의 리소스 요청/제한의 합이다.


## 리소스 요청이 포함된 파드를 스케줄링하는 방법 
파드를 생성할 때 쿠버네티스 스케줄러는 파드를 실행할 노드를 선택한다. 각 노드는 각 리소스 타입(cpu, memory)에 대해 최대 용량을 가지며, 각 리소스 타입마다 스케줄된 컨테이너의 리소스 요청 합계가 노드 용량보다 작도록 한다.

노드의 실제 메모리나 cpu 사용률이 매우 적지만, 용량 확인에 실패한 경우 스케줄러는 노드에 파드를 배치하지 않는다.

## 쿠버네티스가 리소스 요청 및 제한을 적용하는 방법 
- kubelet이 파드의 컨테이너를 시작할 때, kubelet은 해당 컨테이너의 메모리/CPU 요청 및 제한을 컨테이너 런타임에 전달한다.
- 컨테이너 런타임은 적용될 커널 cgroup을 설정하고 명시적 제한을 적용시킨다.
    - cpu 제한
        - 컨테이너가 사용할 수 있는 cpu시간에 대해 강한 상한(hard ceiling)을 적용시킨다.
        - 각 스케줄링 시간마다 리눅스 커널은 이 제한이 초과되었는지 확인하고 만약 초과되었다면 cgroup의 실행 재개를 허가하지 않고 기다린다.
        - cpu 요청은 일반적으로 가중치 설정을 정의한다. 현재 부하율이 높은 시스템에서 여러 개의 컨테이너(cgroup)가 실행되어야 하는 경우, 큰 CPU 요청값을 갖는 워크로드가 작은 CPU 요청값을 갖는 워크로드보다 더 많은 CPU 시간을 할당받는다.
        - 컨테이너가 비교적 긴 시간 동안 CPU 제한을 초과하는 것이 허용될 수도, 허용되지 않을 수도 있다. 그러나, 컨테이너 런타임은 과도한 CPU 사용률을 이유로 파드 또는 컨테이너를 종료시키지는 않는다.
    - 메모리 제한
        - 메모리 요청은 주로 (쿠버네티스) 파드 스케줄링 과정에서 사용된다. cgroup v2를 사용하는 노드에서, 컨테이너 런타임은 메모리 요청을 힌트로 사용하여 memory.min 및 memory.low을 설정할 수 있다.
        - 메모리 제한은 해당 cgroup에 대한 메모리 사용량 상한을 정의한다. 컨테이너가 제한보다 더 많은 메모리를 할당받으려고 시도하면, 리눅스 커널의 메모리 부족(out-of-memory) 서브시스템이 활성화되고 (일반적으로) 개입하여 메모리를 할당받으려고 했던 컨테이너의 프로세스 중 하나를 종료한다. 해당 프로세스의 PID가 1이고, 컨테이너가 재시작 가능(restartable)으로 표시되어 있으면, 쿠버네티스가 해당 컨테이너를 재시작한다.
        - 파드 또는 컨테이너의 메모리 제한은 메모리 기반 볼륨(예: emptyDir)의 페이지에도 적용될 수 있다. kubelet은 tmpfs emptyDir 볼륨을 로컬 임시(ephemeral) 스토리지가 아닌 컨테이너 메모리 사용으로 간주하여 추적한다.
        - 한 컨테이너가 메모리 요청을 초과하고 해당 노드의 메모리가 부족하지면, 해당 컨테이너가 속한 파드가 축출될 수 있다.



(https://kubernetes.io/ko/docs/concepts/configuration/manage-resources-containers/)