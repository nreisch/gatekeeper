"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4822],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),c=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return o.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=r,k=u["".concat(l,".").concat(m)]||u[m]||d[m]||a;return n?o.createElement(k,i(i({ref:t},p),{},{components:n})):o.createElement(k,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6012:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return d}});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),i=["components"],s={id:"workload-resources",title:"Working with Workload Resources"},l=void 0,c={unversionedId:"workload-resources",id:"version-v3.12.x/workload-resources",title:"Working with Workload Resources",description:"Workload Validation",source:"@site/versioned_docs/version-v3.12.x/workload-resources.md",sourceDirName:".",slug:"/workload-resources",permalink:"/gatekeeper/website/docs/workload-resources",draft:!1,editUrl:"https://github.com/open-policy-agent/gatekeeper/edit/master/website/versioned_docs/version-v3.12.x/workload-resources.md",tags:[],version:"v3.12.x",frontMatter:{id:"workload-resources",title:"Working with Workload Resources"},sidebar:"docs",previous:{title:"The gator CLI",permalink:"/gatekeeper/website/docs/gator"},next:{title:"Operations",permalink:"/gatekeeper/website/docs/operations"}},p={},d=[{value:"Workload Validation",id:"workload-validation",level:2},{value:"Example",id:"example",level:3},{value:"Workload Mutation",id:"workload-mutation",level:2}],u={toc:d};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,a.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"workload-validation"},"Workload Validation"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/workloads/"},"Workload resources")," are Kubernetes resources like Deployments or DaemonSets that create Pods by-way-of a controller. Because many Gatekeeper validation policies are written to enforce against Pods, like those found in the ",(0,a.kt)("a",{parentName:"p",href:"https://www.github.com/open-policy-agent/gatekeeper-library"},"Gatekeeper policy library"),", it is important to recognize that Gatekeeper Pod violation messages will not be directly reported to the user when using the library as those Pods are created from workload resources."),(0,a.kt)("p",null,"To reject workload resources that can create a resource that violates a constraint, checkout the ",(0,a.kt)("a",{parentName:"p",href:"/gatekeeper/website/docs/expansion"},"Validation of Workload Resources")," feature available in Gatekeeper v3.10+."),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: constraints.gatekeeper.sh/v1beta1\nkind: K8sPSPPrivilegedContainer\nmetadata:\n  name: psp-privileged-container\nspec:\n  match:\n    kinds:\n      - apiGroups: [""]\n        kinds: ["Pod"]\n')),(0,a.kt)("p",null,"The above constraint matches on Pods that pass through the Gatekeeper admission controller. If you create a Deployment with the following PodTemplateSpec, then the Deployment itself will not be blocked, even though the containers in the Deployment violate the constraint."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  labels:\n    app: i-wont-be-blocked\n  name: i-wont-be-blocked\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: i-wont-be-blocked\n  template:\n    metadata:\n      labels:\n        app: i-wont-be-blocked\n    spec:\n      containers:\n      - image: nginx\n        name: nginx\n        securityContext:\n          privileged: true\n")),(0,a.kt)("p",null,"Instead, the Pods that are created from the Deployment will be blocked, and the Gatekeeper denial messages will be found in the workload object responsible for creating the Pods (in this case, the ReplicaSet created by the Deployment). The denial message will eventually make its way into the Deployment's status as well."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},'status:\n  conditions:\n  - message: \'admission webhook "validation.gatekeeper.sh" denied the request: [psp-privileged-container]\n      Privileged container is not allowed: nginx, securityContext: {"privileged":true}\'\n')),(0,a.kt)("p",null,"Gatekeeper violation messages within statuses can be retrieved using a ",(0,a.kt)("inlineCode",{parentName:"p"},"kubectl")," command like the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'$ kubectl get replicaset i-wont-be-blocked-755547df65 -o jsonpath=\'{ .status.conditions[].message }\'\nadmission webhook "validation.gatekeeper.sh" denied the request: [psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true}\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'$ kubectl get deploy i-wont-be-blocked -o jsonpath=\'{ .status.conditions[*].message }\'\nDeployment does not have minimum availability. admission webhook "validation.gatekeeper.sh" denied the request: [psp-privileged-container] Privileged container is not allowed: nginx, securityContext: {"privileged": true} ReplicaSet "i-wont-be-blocked-755547df65" has timed out progressing.\n')),(0,a.kt)("p",null,'Note that adding workload objects to the "kinds" list in the ',(0,a.kt)("a",{parentName:"p",href:"https://www.github.com/open-policy-agent/gatekeeper-library"},"Gatekeeper policy library constraints")," will not block and alert on workload resources. This is because most of the source Rego code for the library constraints match on the ",(0,a.kt)("inlineCode",{parentName:"p"},"spec.containers[_]")," field instead of the ",(0,a.kt)("inlineCode",{parentName:"p"},"spec.template.spec.containers[_]")," field that is often the format used by the PodTemplateSpec in workload resources."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"input_containers[c] { \n  c := input.review.object.spec.containers[_] \n} \ninput_containers[c] { \n  c := input.review.object.spec.initContainers[_] \n} \n")),(0,a.kt)("h2",{id:"workload-mutation"},"Workload Mutation"),(0,a.kt)("p",null,"Similar to Gatekeeper validation policies, Gatekeeper mutation policies can act on individual Pods or the workload resources that generate those Pods. Mutations on workload resource PodTemplateSpecs will implicitly mutate the Pods that are generated by that workload resource. In contrast, mutations on individual Pods will not bubble up to the parent workload resource's PodTemplateSpec."),(0,a.kt)("p",null,"Use the ",(0,a.kt)("a",{parentName:"p",href:"/gatekeeper/website/docs/mutation#extent-of-changes"},"extent of changes")," section in mutation policies to granularly specify the scope of a mutation."))}m.isMDXComponent=!0}}]);