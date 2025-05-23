---
id: constrainttemplates
title: Constraint Templates
---

ConstraintTemplates define a way to validate some set of Kubernetes objects in Gatekeeper's Kubernetes [admission controller](https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/).  They are made of two main elements:

1. [Rego](https://www.openpolicyagent.org/docs/latest/#rego) code that defines a policy violation
2. The schema of the accompanying `Constraint` object, which represents an instantiation of a `ConstraintTemplate`


## `v1` Constraint Template

In release version 3.6.0, Gatekeeper included the `v1` version of `ConstraintTemplate`.  Unlike past versions of `ConstraintTemplate`, `v1` requires the Constraint schema section to be [structural](https://kubernetes.io/blog/2019/06/20/crd-structural-schema/).

Structural schemas have a variety of [requirements](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).  One such requirement is that the `type` field be defined for each level of the schema.

For example, users of Gatekeeper may recognize the `k8srequiredlabels` ConstraintTemplate, defined here in version `v1beta1`:

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

The `parameters` field schema (`spec.crd.spec.validation.openAPIV3Schema`) is _not_ structural.  Notably, it is missing the `type:` declaration:

```yaml
openAPIV3Schema:
  # missing type
  properties:
    labels:
      type: array
      items:
        type: string
```

This schema is _invalid_ by default in a `v1` ConstraintTemplate.  Adding the `type` information makes the schema valid:

```yaml
openAPIV3Schema:
  type: object
  properties:
    labels:
      type: array
      items:
        type: string
```

For more information on valid types in JSONSchemas, see the [JSONSchema documentation](https://json-schema.org/understanding-json-schema/reference/type.html).

## Why implement this change?

Structural schemas are required in version `v1` of `CustomResourceDefinition` resources, which underlie ConstraintTemplates.  Requiring the same in ConstraintTemplates puts Gatekeeper in line with the overall direction of Kubernetes.

Beyond this alignment, structural schemas yield significant usability improvements. The schema of a ConstraintTemplate's associated Constraint is both more visible and type validated.

As the data types of Constraint fields are defined in the ConstraintTemplate, the API server will reject a Constraint with an incorrect `parameters` field. Previously, the API server would ingest it and simply not pass those `parameters` to Gatekeeper.  This experience was confusing for users, and is noticeably improved by structural schemas.

For example, see this incorrectly defined `k8srequiredlabels` Constraint:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-gk
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    # Note that "labels" is now contained in an array item, rather than an object key under "parameters"
    - labels: ["gatekeeper"]
```

In a `v1beta1` ConstraintTemplate, this Constraint would be ingested successfully.  However, it would not work.  The creation of a new namespace, `foobar`, would succeed, even in the absence of the `gatekeeper` label:

```shell
$ kubectl create ns foobar
namespace/foobar created
```

This is incorrect.  We'd expect this to fail:

```shell
$ kubectl create ns foobar
Error from server ([ns-must-have-gk] you must provide labels: {"gatekeeper"}): admission webhook "validation.gatekeeper.sh" denied the request: [ns-must-have-gk] you must provide labels: {"gatekeeper"}
```

The structural schema requirement _prevents this mistake_.  The aforementioned `type: object` declaration would prevent the API server from accepting the incorrect `k8srequiredlabels` Constraint.

```shell
# Apply the Constraint with incorrect parameters schema
$ cat << EOF | kubectl apply -f -
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-gk
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    # Note that "labels" is now an array item, rather than an object
    - labels: ["gatekeeper"]
EOF
The K8sRequiredLabels "ns-must-have-gk" is invalid: spec.parameters: Invalid value: "array": spec.parameters in body must be of type object: "array"
```

Fixing the incorrect `parameters` section would then yield a successful ingestion and a working Constraint.

```shell
$ cat << EOF | kubectl apply -f -
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-gk
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["gatekeeper"]
EOF
k8srequiredlabels.constraints.gatekeeper.sh/ns-must-have-gk created
```

```shell
$ kubectl create ns foobar
Error from server ([ns-must-have-gk] you must provide labels: {"gatekeeper"}): admission webhook "validation.gatekeeper.sh" denied the request: [ns-must-have-gk] you must provide labels: {"gatekeeper"}
```

## Enable OPA Rego v1 syntax in ConstraintTemplates

Gatekeeper 3.19 ships with ability to use OPA Rego v1 as policy language in ConstraintTemplates. Using Rego v1 syntax is opt-in, by default only Rego v0 is allowed. You can use below spec to enable Rego v1 syntax:

```yaml
...
  targets:
    - target: admission.k8s.gatekeeper.sh
      code:
        - engine: Rego
          source:
            version: "v1"
            rego: |
              <v1-rego-code>
...
```

:::note
Rego v1 syntax can only be used under `targets[_].code[_].[engine: Rego].source` with `version: "v1"`. No need to add `import rego.v1` to use rego v1 syntax.
:::

Here is a sample ConstraintTemplate using Rego v1 syntax:

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          type: object
          properties:
            message:
              type: string
            labels:
              type: array
              items:
                type: object
                properties:
                  key:
                    type: string
                  allowedRegex:
                    type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      code:
        - engine: Rego
          source:
            version: "v1"
            rego: |
              package k8srequiredlabels

              violation contains 
                {"msg": msg, "details": {"missing_labels": missing}} 
                if {
                  provided := {label | input.review.object.metadata.labels[label]}
                  required := {label | label := input.parameters.labels[_]}
                  missing := required - provided
                  count(missing) > 0
                  msg := sprintf("you must provide labels: %v", [missing])
                }
```

## Built-in variables across all engines

### Common variables

### Rego variables

| Variable | Description |
| --- | --- |
| `input.review` | Contains input request object under review |
| `input.parameters` | Contains constraint parameters e.g. `input.parameters.repos` see [example](https://open-policy-agent.github.io/gatekeeper-library/website/validation/allowedrepos) |
| `data.lib`     |  It serves as an import path for helper functions defined under `libs` in ConstraintTemplate, e.g. data.lib.exempt_container.is_exempt see [example](https://open-policy-agent.github.io/gatekeeper-library/website/validation/host-network-ports) |
| `data.inventory` | Refers to a structure that stores synced cluster resources. It is used in Rego policies to validate or enforce referential rules based on the current state of the cluster. e.g. unique ingress host [example](https://open-policy-agent.github.io/gatekeeper-library/website/validation/uniqueingresshost/) |

### CEL variables

| Variable | Description |
| --- | --- |
| `variables.params` | Contains constraint parameters e.g. `variables.params.labels` see [example](https://open-policy-agent.github.io/gatekeeper-library/website/validation/requiredlabels) |
| `variables.anyObject` | Contains either an object or (on DELETE requests) oldObject, see [example](https://open-policy-agent.github.io/gatekeeper-library/website/validation/requiredlabels) |
